<template>
  <b-modal
    :id="id"
    title="Case Detail Modal"
    centered
    size="xl"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <h2 class="m-0">Case Detail</h2>
    </template>
    <b-form @submit.prevent>
      <b-tabs content-class="py-1" fill v-model="tabIndex">
        <b-tab no-body>
          <template #title>
            <feather-icon
              icon="FileIcon"
              :class="detailModalFormState ? 'text-danger' : ''"
            />
            <span
              style="font-weight: bold"
              :class="detailModalFormState ? 'text-danger' : ''"
              >Detail</span
            >
          </template>
          <validation-observer ref="caseDetailFormValidation">
            <CaseDetailForm
              @refreshDataWithAward="refreshDataWithAward"
              :item="caseObject"
              ref="detailModalForm"
              :mode="formMode"
              :allowEdit="this.allowEdit"
              :isSubmtRequested="isSubmtRequested"
              @removeIndividual="removeIndividual"
              @uploadDocAndAward="uploadDocAndAward"
              @removeCivilian="removeCivilian"
              :key="`case-detail-form-${caseDetailFormCount}`"
            />
          </validation-observer>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon
              icon="FileIcon"
              :class="detailModalFormState ? 'text-danger' : ''"
            />
            <span
              style="font-weight: bold"
              :class="detailModalFormState ? 'text-danger' : ''"
              >Case History</span
            >
          </template>
          <validation-observer ref="casedetailModalFormValidation">
            <CaseHistoryForm :caseObject="caseObject" />
          </validation-observer>
        </b-tab>
      </b-tabs>
    </b-form>

    <template #modal-footer>
      <b-form-group class="text-right" v-if="item !== null">
        <!-- <b-button type="submit" variant="info" pill class="mr-50" @click="validationdetailModalForm"
                    v-if="tabIndex === 0 && currentlyMarked">
                    Update
                </b-button> -->

        <!-- EXIT/CLOSE BUTTON -->
        <b-button
          type="submit"
          variant="danger"
          pill
          class="mr-1"
          @click="closeCaseModal"
        >
          Exit
        </b-button>

        <!-- UPDATE BUTTON -->
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-50"
          @click="validationUpdateForm"
          v-if="
            (getLoggedInUser.role_data.code_name === 'su' && allowEdit) ||
            (hasPermission('case_verify') &&
              item.status != caseStatus.FINALIZED &&
              allowEdit) ||
            (item.is_verified &&
              item.president == getLoggedInUser.id &&
              item.status != caseStatus.CLOSED &&
              item.status != caseStatus.FINALIZED &&
              allowEdit) ||
            (item.status == caseStatus.PENDING && allowEdit) ||
            (currentlyMarked && allowEdit)
          "
        >
          Update
        </b-button>

        <!-- MARK BUTTON -->
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-50"
          v-if="
            (tabIndex === 0 && currentlyMarked && allowEdit) ||
            (item.status == caseStatus.PENDING && allowEdit)
          "
          @click="validationMarkForm"
        >
          Mark
        </b-button>

        <!-- MARK FOR VERIFICATION BUTTON -->
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-1"
          v-if="
            item.status == caseStatus.PENDING && !hasPermission('case_verify')
          "
          @click="MarkForVerificationValidationForm"
        >
          Mark for Verification
        </b-button>

        <!-- VERIFY BUTTON -->
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-1"
          @click="validationVerifyForm"
          v-if="
            hasPermission('case_verify') &&
            !item.is_verified &&
            allowEdit &&
            getLoggedInUser.role_data.code_name !== 'su'
          "
        >
          <span class="align-middle">Verify</span>
        </b-button>

        <!-- FINALIZE BUTTON -->
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-1"
          @click="validationFinalizeForm"
          v-if="
            item.is_verified &&
            item.president == getLoggedInUser.id &&
            item.status != caseStatus.CLOSED &&
            item.status != caseStatus.FINALIZED &&
            allowEdit
          "
        >
          <span class="align-middle">Finalized</span>
        </b-button>

        <!-- Case CLOSED BUTTON -->
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-1"
          @click="validationCloseForm"
          v-if="
            item.is_verified &&
            item.verify_by == getLoggedInUser.id &&
            item.status == caseStatus.FINALIZED &&
            allowEdit
          "
        >
          <span class="align-middle">Close Case</span>
        </b-button>
      </b-form-group>
    </template>
  </b-modal>
</template>
  
<script>
import store from "@/store";
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CaseDetailForm from "@/components/caseForm/CaseDetailForm.vue";
import CaseHistoryForm from "@/components/caseHistory/CaseHistoryForm.vue";
import util from "@/util.js";
import moment from "moment";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    CaseDetailForm,
    CaseHistoryForm,
  },
  props: {
    item: Object,
    startTab: {
      type: Number,
      default: 0,
    },
    allowEdit: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: "case-detail-modal",
    },
  },
  mixins: [util],
  data() {
    return {
      tabIndex: 0,
      caseObject: null,
      detailModalFormState: false,
      vcase: null,
      date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      retain: false,
      seen: false,
      formMode: null,
      isSubmtRequested: false,
      isIndividualRemoved: false,
      individualsRemovedPk: [],
      isDocAwardUploaded: false,
      uploadDocAwardData: [],
      civilianRemovedData: [],
      isCivilianRemoved: false,
      caseDetailFormCount: 0,
    };
  },
  mounted() {
    this.initializeMethod();
  },
  methods: {
    ...mapActions({
      updateCase: "appData/updateCase",
      verifyCase: "appData/verifyCase",
      finalizeCase: "appData/finalizeCase",
      closeCase: "appData/closeCase",
      getCase: "appData/getCase",
      deleteIndividual: "appData/deleteIndividual",
      createDocumentAward: "appData/createDocumentAward",
      deleteCivilian: "appData/removeCivilian",
    }),
    initializeMethod() {
      if (this.item) {
        this.tabIndex = this.startTab;
        this.caseObject = this.item;

        // Check conditions to set the formMode
        if (this.allowEdit) {
          if (this.getLoggedInUser.role_data.code_name === "su") {
            this.formMode = this.modes.EDIT;
          } else if (
            (this.hasPermission("case_verify") &&
              this.item.status != this.caseStatus.FINALIZED) ||
            (this.item.is_verified &&
              this.item.president == this.getLoggedInUser.id &&
              this.item.status != this.caseStatus.CLOSED &&
              this.item.status != this.caseStatus.FINALIZED) ||
            this.item.status == this.caseStatus.PENDING || 
            this.currentlyMarked
          ) {
            this.formMode = this.modes.EDIT;
          } else {
            this.formMode = this.modes.VIEW;
          }
        } else {
          this.formMode = this.modes.VIEW;
        }
      }
    },
    removeIndividual(indv) {
      const pk = indv.id;
      this.individualsRemovedPk.push(pk);
      this.isIndividualRemoved = true;
    },

    uploadDocAndAward(data) {
      this.uploadDocAwardData.push(data);
      this.isDocAwardUploaded = true;
    },

    removeCivilian(civ) {
      this.civilianRemovedData.push(civ);
      this.isCivilianRemoved = true;
    },

    async refreshDataWithAward() {
      try {
        const res = await this.getCase({ pk: this.item.id });
        if (res.status == 200) {
          this.caseObject = res.data;
        }
      } catch (error) {
        this.displayError(error);
      }
    },
    async validationMarkForm() {
      let success = await this.$refs.caseDetailFormValidation.validate();
      if (success) {
        this.detailModalFormState = false;
        await this.submit();
      } else {
        this.detailModalFormState = true;
      }
    },
    async MarkForVerificationValidationForm() {
      this.isSubmtRequested = true;
      let success = await this.$refs.caseDetailFormValidation.validate();
      if (success) {
        this.detailModalFormState = false;
        await this.MarkForVerificationSubmit();
      } else {
        this.detailModalFormState = true;
      }
    },
    async validationUpdateForm() {
      await this.$refs.detailModalForm.setDraft(true);
      let success = await this.$refs.caseDetailFormValidation.validate();
      if (success) {
        this.detailModalFormState = false;
        await this.update();
      } else {
        this.detailModalFormState = true;
      }
    },

    async validationVerifyForm() {
      await this.$refs.detailModalForm.setDraft(true);
      let success = await this.$refs.caseDetailFormValidation.validate();
      if (success) {
        this.detailModalFormState = false;
        await this.verify();
      } else {
        this.detailModalFormState = true;
      }
    },

    async validationFinalizeForm() {
      await this.$refs.detailModalForm.setDraft(true);
      let success = await this.$refs.caseDetailFormValidation.validate();
      if (success) {
        this.detailModalFormState = false;
        await this.finalize();
      } else {
        this.detailModalFormState = true;
      }
    },

    async validationCloseForm() {
      await this.$refs.detailModalForm.setDraft(true);
      let success = await this.$refs.caseDetailFormValidation.validate();
      if (success) {
        this.detailModalFormState = false;
        await this.closed();
      } else {
        this.detailModalFormState = true;
      }
    },
    async submit() {
      const detailModalForm = this.$refs.detailModalForm.$data;
      try {
        const users = detailModalForm.markedUserList.map((user) => {
          return user.id;
        });
        if (users) {
          if (users.length === 0) {
            this.displayError("Case has to be marked");
            return;
          }
        }

        // if (detailModalForm.comment.length > detailModalForm.maxCommentCount) {
        //     this.displayError(
        //         `Comment Length cannot be greater than ${detailModalForm.maxCommentCount}`
        //     );
        //     return;
        // }

        const civilian_involved_ids = detailModalForm.civilians.map((civ) => {
          return civ.id;
        });

        const individual_involved = detailModalForm.individual_involved.map(
          (officer) => {
            return {
              individual: officer.individual ?? officer.id,
              created_by: this.getLoggedInUser.id,
            };
          }
        );

        const history = [];
        if (detailModalForm.comment) {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            history.push({
              comment: detailModalForm.comment,
              is_private: detailModalForm.isPrivate,
              // documents_id: mark_documents_id,
              marked_from: this.getLoggedInUser.id,
              marked_to: user,
            });
          }
        }

        if (detailModalForm.comment) {
          if (users) {
            if (users.length === 0) {
              this.$swal({
                title: "Comment Not allowed without User Marked",
                icon: "error",
              });
              return;
            }
          }
        }

        // const documents_id = detailModalForm.documents.map((document) => {
        //     return document.id;
        // });

        const data = {
          brief: detailModalForm.brief ? detailModalForm.brief : "",
          no_of_officer: detailModalForm.no_of_officer,
          remarks: detailModalForm.remarks ? detailModalForm.remarks : "",
          history: history,
          // documents_id: documents_id,
          status: detailModalForm.status ? detailModalForm.status.value : "",
          start_date: detailModalForm.start_date
            ? detailModalForm.start_date
            : "",
          completion_date: detailModalForm.completion_date
            ? detailModalForm.completion_date
            : "",
          president: detailModalForm.president
            ? detailModalForm.president.id
            : null,
          ordered_by: detailModalForm.ordered_by
            ? detailModalForm.ordered_by.id
            : null,
          // members_ids: members_ids,
          recom: detailModalForm.recom,
          findings: detailModalForm.findings,
          individual_involved: individual_involved,
          civilian_involved_ids: civilian_involved_ids,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
          noc: detailModalForm.noc ? detailModalForm.noc.id : null,
          award: detailModalForm.award ? detailModalForm.award.id : null,
          unit: detailModalForm.unit ? detailModalForm.unit.id : null,
          formation: detailModalForm.formation
            ? detailModalForm.formation.id
            : null,
          retain: this.retain,
          seen: this.seen,
        };
        console.log(data);
        const res = await this.updateCase({ payload: data, pk: this.item.id });
        if (res.status === 200) {
          this.$swal({
            title: "Case Marked successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide(this.id);
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async MarkForVerificationSubmit() {
      const detailModalForm = this.$refs.detailModalForm.$data;
      try {
        const users = detailModalForm.markedUserList.map((user) => {
          return user.id;
        });

        if (users.length === 0) {
          this.displayError("Case has to be marked");
          return;
        }

        // if (detailModalForm.comment.length > detailModalForm.maxCommentCount) {
        //     this.displayError(
        //         `Comment Length cannot be greater than ${detailModalForm.maxCommentCount}`
        //     );
        //     return;
        // }

        // const members_ids = detailModalForm.members.map((member) => {
        //   return member.id;
        // });
        // const officer_involved_ids = detailModalForm.officer_involved.map(
        //   (officer) => {
        //     return officer.id;
        //   }
        // );

        const civilian_involved_ids = detailModalForm.civilians.map((civ) => {
          return civ.id;
        });

        const individual_involved = detailModalForm.individual_involved.map(
          (officer) => {
            return {
              individual: officer.individual ?? officer.id,
              created_by: this.getLoggedInUser.id,
            };
          }
        );
        const codeName = "ver";
        console.log(detailModalForm.markedUserList);
        const userCodeName =
          detailModalForm.markedUserList[0].role_data.code_name;
        if (codeName != userCodeName) {
          this.$swal({
            title: "Marked User Does not have Verifier Role",
            icon: "error",
          });
          return;
        }

        const history = [];
        if (detailModalForm.comment) {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            history.push({
              comment: detailModalForm.comment,
              is_private: detailModalForm.isPrivate,
              // documents_id: mark_documents_id,
              marked_from: this.getLoggedInUser.id,
              marked_to: user,
            });
          }
        }

        // const documents_id = detailModalForm.documents.map((document) => {
        //     return document.id;
        // });
        // if (detailModalForm.president){
        //   this.displayError("Marked User Does not have Verifier Role");
        //   return;
        // }

        const data = {
          brief: detailModalForm.brief ? detailModalForm.brief : "",
          remarks: detailModalForm.remarks ? detailModalForm.remarks : "",
          draft: this.draft,
          history: history,
          // documents_id: documents_id,
          //   status: detailModalForm.status ? detailModalForm.status.value : "",
          status: 1,
          // start_date: detailModalForm.start_date ? detailModalForm.start_date : "",
          // completion_date: detailModalForm.completion_date
          //   ? detailModalForm.completion_date
          //   : null,
          president: detailModalForm.president
            ? detailModalForm.president.id
            : null,
          ordered_by: detailModalForm.ordered_by
            ? detailModalForm.ordered_by.id
            : null,
          recom: detailModalForm.recom,
          findings: detailModalForm.findings,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
          noc: detailModalForm.noc ? detailModalForm.noc.id : null,
          individual_involved: individual_involved,
          civilian_involved_ids: civilian_involved_ids,
          unit: detailModalForm.unit ? detailModalForm.unit.id : null,
          formation: detailModalForm.formation
            ? detailModalForm.formation.id
            : null,
          retain: this.retain,
          seen: this.seen,
        };
        console.log("case mark for verification: ", data);
        const res = await this.updateCase({ payload: data, pk: this.item.id });
        console.log("res", res);
        if (res.status === 200) {
          this.$swal({
            title: "Case Marked for Verification successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide(this.id);
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        console.log("error", error);
      }
    },

    async update() {
      const detailModalForm = this.$refs.detailModalForm.$data;
      try {
        const users = detailModalForm.markedUserList.map((user) => {
          return user.id;
        });
        // if (users) {
        //   if (users.length === 0) {
        //     this.displayError("Case has to be marked");
        //     return;
        //   }
        // }

        // if (detailModalForm.comment.length > detailModalForm.maxCommentCount) {
        //     this.displayError(
        //         `Comment Length cannot be greater than ${detailModalForm.maxCommentCount}`
        //     );
        //     return;
        // }

        const civilian_involved_ids = detailModalForm.civilians.map((civ) => {
          return civ.id;
        });

        const individual_involved = detailModalForm.individual_involved.map(
          (officer) => {
            return {
              individual: officer.individual ?? officer.id,
              created_by: this.getLoggedInUser.id,
            };
          }
        );

        const history = [];
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          history.push({
            comment: detailModalForm.comment,
            is_private: detailModalForm.isPrivate,
            // documents_id: mark_documents_id,
            marked_from: this.getLoggedInUser.id,
            marked_to: user,
          });
        }

        if (detailModalForm.comment) {
          if (users) {
            if (users.length === 0) {
              this.$swal({
                title: "Comment Not allowed without User Marked",
                icon: "error",
              });
              return;
            }
          }
        }

        // const documents_id = detailModalForm.documents.map((document) => {
        //     return document.id;
        // });

        if (this.isIndividualRemoved) {
          try {
            for (var i = 0; i < this.individualsRemovedPk.length; i++) {
              const res = await this.deleteIndividual({
                pk: this.individualsRemovedPk[i],
              });
              if (res.status === 204) {
                console.log("Individual Deleted Successfully");
              }
            }
          } catch (error) {
            console.log("error", error);
          }
        }

        if (this.isCivilianRemoved) {
          try {
            for (var i = 0; i < this.civilianRemovedData.length; i++) {
              const data = {
                case_id: this.civilianRemovedData[i].case_id,
                civilian_id: this.civilianRemovedData[i].id,
              };
              const res = await this.deleteCivilian(data);
              if (res.status === 200) {
                console.log("Civilian Deleted Successfully");
              }
            }
          } catch (error) {
            console.log("error", error);
          }
        }

        const data = {
          brief: detailModalForm.brief ? detailModalForm.brief : "",
          no_of_officer: detailModalForm.no_of_officer,
          remarks: detailModalForm.remarks ? detailModalForm.remarks : "",
          history: history,
          // documents_id: documents_id,
          status: detailModalForm.status ? detailModalForm.status.value : "",
          start_date: detailModalForm.start_date
            ? detailModalForm.start_date
            : "",
          completion_date: detailModalForm.completion_date
            ? detailModalForm.completion_date
            : "",
          president: detailModalForm.president
            ? detailModalForm.president.id
            : null,
          ordered_by: detailModalForm.ordered_by
            ? detailModalForm.ordered_by.id
            : null,
          // members_ids: members_ids,
          recom: detailModalForm.recom,
          individual_involved: individual_involved,
          civilian_involved_ids: civilian_involved_ids,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
          noc: detailModalForm.noc ? detailModalForm.noc.id : null,
          award: detailModalForm.award ? detailModalForm.award.id : null,
          unit: detailModalForm.unit ? detailModalForm.unit.id : null,
          formation: detailModalForm.formation
            ? detailModalForm.formation.id
            : null,
        };
        console.log(data);
        const res = await this.updateCase({ payload: data, pk: this.item.id });

        if (res.status === 200) {
          this.$swal({
            title: "Case Update successfully",
            icon: "success",
          });

          if (this.isDocAwardUploaded) {
            try {
              for (var i = 0; i < this.uploadDocAwardData.length; i++) {
                const res = await this.createDocumentAward(
                  this.uploadDocAwardData[i]
                );
                if (res.status === 201) {
                  console.log("document award created Successfully!!");
                }
              }
            } catch (error) {
              console.log("error", error);
            }
          }
          // this.$nextTick(() => {
          //   this.$bvModal.hide(this.id);
          // });
          this.$emit("updateInPlaceData");
          this.caseDetailFormCount += 1;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async verify() {
      try {
        const data = {
          status: this.caseStatus.PROCESSING,
          verify_by: this.getLoggedInUser.id,
          president: this.caseObject.president,
        };

        const res = await this.verifyCase({
          payload: data,
          pk: this.caseObject.id,
        });
        console.log("res", res);
        if (res.status === 200) {
          this.$swal({
            title:
              "Draft COI has been Approved & Visible to President(COI) & PS Dte",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide(this.id);
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },

    async finalize() {
      const detailModalForm = this.$refs.detailModalForm.$data;
      try {
        if (detailModalForm.individual_involved.length > 0) {
          for (let i = 0; i < detailModalForm.individual_involved.length; i++) {
            // Check if award or document is empty for each individual involved
            if (
              detailModalForm.individual_involved[i].award === null ||
              detailModalForm.individual_involved[i].document === null
            ) {
              this.$swal({
                title: "Award & document is required for individual",
                icon: "error",
              });
              return;
            }
          }

          if (detailModalForm.recom === "") {
            this.$swal({
              title: "Add a Recommentation its required",
              icon: "error",
            });
            return;
          }
          const data = {
            status: this.caseStatus.FINALIZED,
            verify_by: this.caseObject.verify_by,
            president: this.getLoggedInUser.id,
            recom: detailModalForm.recom,
          };
          const res = await this.finalizeCase({
            payload: data,
            pk: this.caseObject.id,
          });

          console.log("res", res);
          if (res.status === 200) {
            this.$swal({
              title: "Case Finalize successfully",
              icon: "success",
            });
            this.$nextTick(() => {
              this.$bvModal.hide(this.id);
            });
            this.$emit("modalClosed");
          }
        } else {
          this.$swal({
            title: `Individual is required.`,
            icon: "error",
          });
          return;
        }
      } catch (error) {
        this.displayError(error);
      }
    },

    async closed() {
      try {
        const data = {
          status: this.caseStatus.CLOSED,
          verify_by: this.getLoggedInUser.id,
          president: this.item.president,
        };

        const res = await this.closeCase({
          payload: data,
          pk: this.caseObject.id,
        });
        console.log("res", res);
        if (res.status === 200) {
          this.$swal({
            title: "Case Closed successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide(this.id);
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },

    closeCaseModal() {
      this.$nextTick(() => {
        this.$bvModal.hide(this.id);
      });
      this.$emit("modalClosed");
    },
  },
  computed: {
    ...mapGetters({
      getLoggedInUser: "appData/getLoggedInUser",
      hasPermission: "appData/hasPermission",
      hasRole: "appData/hasRole",
    }),
    currentlyMarked() {
      for (let i = 0; i < this.item.history.length; i++) {
        const hist = this.item.history[i];
        if (!hist.marked_to_data) {
          return false;
        } else if (
          hist.marked_to_data.appointment_id ==
            this.getLoggedInUser.appointment_id &&
          hist.marked_to_data.organization_id ==
            this.getLoggedInUser.organization &&
          hist.is_retain
        ) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>
  
<style lang="scss" scoped></style>