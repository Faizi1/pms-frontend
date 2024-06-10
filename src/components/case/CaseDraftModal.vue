<template>
  <b-modal
    id="case-draft-modal"
    title="RFA Detail Modal"
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
              :class="detailFormState ? 'text-danger' : ''"
            />
            <span :class="detailFormState ? 'text-danger' : ''">Detail</span>
          </template>
          <validation-observer ref="caseDraftFormValidation">
            <CaseDetailForm
              @refreshDataWithAward="refreshDataWithAward"
              :item="item"
              ref="detailForm"
              :mode="modes.CREATE"
              :isSubmtRequested="isSubmtRequested"
              @removeIndividual="removeIndividual"
              @uploadDocAndAward="uploadDocAndAward"
              @removeCivilian="removeCivilian"
            />
          </validation-observer>
        </b-tab>

        <b-tab>
          <template #title>
            <feather-icon
              icon="FileIcon"
              :class="detailFormState ? 'text-danger' : ''"
            />
            <span :class="detailFormState ? 'text-danger' : ''"
              >Case History</span
            >
          </template>
          <validation-observer ref="caseDraftFormModalValidation">
            <CaseHistoryForm :caseObject="item" />
          </validation-observer>
        </b-tab>
      </b-tabs>
    </b-form>

    <template #modal-footer>
      <b-form-group class="text-right" v-if="item !== null">
        <!-- <b-button type="submit" variant="info" pill class="mr-50" @click="validationForm">
                    Update
                </b-button> -->

        <!-- RESET BUTTON -->
        <b-button
          type="submit"
          variant="secondary"
          pill
          class="mr-1"
          @click="reset"
        >
          Reset
        </b-button>
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
          v-if="item.status == caseStatus.PENDING"
        >
          Update
        </b-button>
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-50"
          v-if="item !== null"
          @click="validationForm"
        >
          Mark
        </b-button>

        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-1"
          v-if="item.status == caseStatus.PENDING"
          @click="MarkForVerificationValidationForm"
        >
          Mark for Verification
        </b-button>
      </b-form-group>
    </template>
  </b-modal>
</template>
  
<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CaseDetailForm from "@/components/caseForm/CaseDetailForm.vue";
import CaseHistoryForm from "@/components/caseHistory/CaseHistoryForm.vue";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    CaseDetailForm,
    CaseHistoryForm,
  },
  props: {
    item: Object,
    tabIndex: {
      type: Number,
      default: 0,
    },
    id: {
      type: String,
      default: "case-detail-modal",
    },
  },
  mixins: [util],
  data() {
    return {
      detailFormState: false,
      startTab: 0,
      retain: false,
      seen: false,
      isSubmtRequested: false,
      isIndividualRemoved: false,
      individualsRemovedPk: [],
      isDocAwardUploaded: false,
      uploadDocAwardData: [],
      civilianRemovedData: [],
      isCivilianRemoved: false,
    };
  },
  mounted() {
    this.tabIndex = this.startTab;
  },
  methods: {
    ...mapActions({
      updateCase: "appData/updateCase",
      getCase: "appData/getCase",
      deleteIndividual: "appData/deleteIndividual",
      createDocumentAward: "appData/createDocumentAward",
      deleteCivilian: "appData/removeCivilian",
    }),

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

    async validationForm() {
      this.isSubmtRequested = true;
      let success = await this.$refs.caseDraftFormValidation.validate();
      if (success) {
        this.detailFormState = false;
        await this.submit();
      } else {
        this.detailFormState = true;
      }
    },
    async submit() {
      const detailForm = this.$refs.detailForm.$data;
      try {
        const users = detailForm.markedUserList.map((user) => {
          return user.id;
        });

        if (users.length === 0) {
          this.displayError("Case has to be marked");
          return;
        }

        const civilian_involved_ids = detailForm.civilians.map((civ) => {
          return civ.id;
        });

        const individual_involved = detailForm.individual_involved.map(
          (officer) => {
            return {
              individual: officer.individual,
              created_by: this.getLoggedInUser.id,
            };
          }
        );

        // if (detailForm.comment.length > detailForm.maxCommentCount) {
        //     this.displayError(
        //         `Comment Length cannot be greater than ${detailForm.maxCommentCount}`
        //     );
        //     return;
        // }

        // const members_ids = detailForm.members.map((member) => {
        //   return member.id;
        // });
        // const officer_involved_ids = detailForm.officer_involved.map(
        //   (officer) => {
        //     return officer.id;
        //   }
        // );

        const history = [];
        if (detailForm.comment) {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            history.push({
              comment: detailForm.comment,
              is_private: detailForm.isPrivate,
              // documents_id: mark_documents_id,
              marked_from: this.getLoggedInUser.id,
              marked_to: user,
            });
          }
        }

        if (detailForm.comment) {
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
        // const documents_id = detailForm.documents.map((document) => {
        //     return document.id;
        // });
        this.draft = false;

        const data = {
          brief: detailForm.brief ? detailForm.brief : "",
          remarks: detailForm.remarks ? detailForm.remarks : "",
          draft: this.draft,
          history: history,
          // documents_id: documents_id,
          //   status: detailForm.status ? detailForm.status.value : "",
          status: 1,
          // start_date: detailForm.start_date ? detailForm.start_date : "",
          // completion_date: detailForm.completion_date
          //   ? detailForm.completion_date
          //   : null,
          president: detailForm.president ? detailForm.president.id : null,
          ordered_by: detailForm.ordered_by ? detailForm.ordered_by.id : null,
          recom: detailForm.recom,
          findings: detailForm.findings,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
          noc: detailForm.noc ? detailForm.noc.id : null,
          individual_involved: individual_involved,
          civilian_involved_ids: civilian_involved_ids,
          unit: detailForm.unit ? detailForm.unit.id : null,
          formation: detailForm.formation ? detailForm.formation.id : null,
          retain: this.retain,
          seen: this.seen,
        };
        console.log("data from draft", data);
        const res = await this.updateCase({ payload: data, pk: this.item.id });
        if (res.status === 200) {
          this.$swal({
            title: "Case Marked successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("case-draft-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        console.log(error);
      }
    },

    async validationUpdateForm() {
      await this.$refs.detailForm.setDraft(true);
      let success = await this.$refs.caseDraftFormValidation.validate();
      if (success) {
        this.detailFormState = false;
        await this.update();
      } else {
        this.detailFormState = true;
      }
    },
    async update() {
      const detailForm = this.$refs.detailForm.$data;
      try {
        const users = detailForm.markedUserList.map((user) => {
          return user.id;
        });
        // if (users) {
        //   if (users.length === 0) {
        //     this.displayError("Case has to be marked");
        //     return;
        //   }
        // }

        // if (detailForm.comment.length > detailForm.maxCommentCount) {
        //     this.displayError(
        //         `Comment Length cannot be greater than ${detailForm.maxCommentCount}`
        //     );
        //     return;
        // }

        const civilian_involved_ids = detailForm.civilians.map((civ) => {
          return civ.id;
        });

        const individual_involved = detailForm.individual_involved.map(
          (officer) => {
            return {
              individual: officer.individual ?? officer.id,
              created_by: this.getLoggedInUser.id,
            };
          }
        );

        const history = [];
        if (detailForm.comment) {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            history.push({
              comment: detailForm.comment,
              is_private: detailForm.isPrivate,
              // documents_id: mark_documents_id,
              marked_from: this.getLoggedInUser.id,
              marked_to: user,
            });
          }
        }

        if (detailForm.comment) {
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

        // const documents_id = detailForm.documents.map((document) => {
        //     return document.id;
        // });

        const data = {
          brief: detailForm.brief ? detailForm.brief : "",
          no_of_officer: detailForm.no_of_officer,
          remarks: detailForm.remarks ? detailForm.remarks : "",
          history: history,
          // documents_id: documents_id,
          status: detailForm.status ? detailForm.status.value : "",
          start_date: detailForm.start_date ? detailForm.start_date : "",
          completion_date: detailForm.completion_date
            ? detailForm.completion_date
            : "",
          president: detailForm.president ? detailForm.president.id : null,
          ordered_by: detailForm.ordered_by ? detailForm.ordered_by.id : null,
          // members_ids: members_ids,
          recom: detailForm.recom,
          individual_involved: individual_involved,
          civilian_involved_ids: civilian_involved_ids,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
          noc: detailForm.noc ? detailForm.noc.id : null,
          award: detailForm.award ? detailForm.award.id : null,
          unit: detailForm.unit ? detailForm.unit.id : null,
          formation: detailForm.formation ? detailForm.formation.id : null,
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
          // this.$emit("modalClosed");
        }
      } catch (error) {
        console.log(error);
      }
    },

    async MarkForVerificationValidationForm() {
      this.isSubmtRequested = true;
      let success = await this.$refs.caseDraftFormValidation.validate();
      if (success) {
        this.detailFormState = false;
        await this.MarkForVerificationSubmit();
      } else {
        this.detailFormState = true;
      }
    },


    async MarkForVerificationSubmit() {
      const detailForm = this.$refs.detailForm.$data;
      try {
        const users = detailForm.markedUserList.map((user) => {
          return user.id;
        });

        if (users.length === 0) {
          this.displayError("Case has to be marked");
          return;
        }

        const civilian_involved_ids = detailForm.civilians.map((civ) => {
          return civ.id;
        });

        const individual_involved = detailForm.individual_involved.map(
          (officer) => {
            return {
              individual: officer.individual ?? officer.id,
              created_by: this.getLoggedInUser.id,
            };
          }
        );

        const codeName = "ver";
        console.log(detailForm.markedUserList);
        const userCodeName = detailForm.markedUserList[0].role_data.code_name;
        if (codeName != userCodeName) {
          this.$swal({
            title: "Marked User Does not have Verifier Role",
            icon: "error",
          });
          return;
        }

        const history = [];
        if (detailForm.comment) {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            history.push({
              comment: detailForm.comment,
              is_private: detailForm.isPrivate,
              // documents_id: mark_documents_id,
              marked_from: this.getLoggedInUser.id,
              marked_to: user,
            });
          }
        }

        if (detailForm.comment) {
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
        // const documents_id = detailForm.documents.map((document) => {
        //     return document.id;
        // });
        this.draft = false;

        const data = {
          brief: detailForm.brief ? detailForm.brief : "",
          remarks: detailForm.remarks ? detailForm.remarks : "",
          draft: this.draft,
          history: history,
          // documents_id: documents_id,
          //   status: detailForm.status ? detailForm.status.value : "",
          status: 1,
          // start_date: detailForm.start_date ? detailForm.start_date : "",
          // completion_date: detailForm.completion_date
          //   ? detailForm.completion_date
          //   : null,
          president: detailForm.president ? detailForm.president.id : null,
          ordered_by: detailForm.ordered_by ? detailForm.ordered_by.id : null,
          recom: detailForm.recom,
          findings: detailForm.findings,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
          noc: detailForm.noc ? detailForm.noc.id : null,
          individual_involved: individual_involved,
          civilian_involved_ids: civilian_involved_ids,
          unit: detailForm.unit ? detailForm.unit.id : null,
          formation: detailForm.formation ? detailForm.formation.id : null,
          retain: this.retain,
          seen: this.seen,
        };
        console.log("data from draft", data);
        const res = await this.updateCase({ payload: data, pk: this.item.id });
        if (res.status === 200) {
          this.$swal({
            title: "Case Marked for Verifiction successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("case-draft-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        console.log(error);
      }
    },

    closeCaseModal() {
      this.$nextTick(() => {
        this.$bvModal.hide("case-draft-modal");
      });
      this.$emit("modalClosed");
    },

    reset() {
      const detailForm = this.$refs.detailForm.$data;
      detailForm.brief = "";
      detailForm.noc = [];
      detailForm.remarks = "";
      detailForm.comment = "";
      detailForm.recom = "";
      detailForm.unit = [];
      detailForm.formation = [];
      detailForm.availableUserList = [];
      detailForm.markedUserList = [];
      detailForm.individual_involved = [];
      detailForm.civilians = [];
      detailForm.president = null;
      detailForm.ordered_by = null;
    },

    async refreshDataWithAward() {
      try {
        const res = await this.getCase({ pk: this.item.id });
        if (res.status == 200) {
          this.item = res.data;
        }
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    ...mapGetters({
      getLoggedInUser: "appData/getLoggedInUser",
      hasPermission: "appData/hasPermission",
      hasRole: "appData/hasRole",
    }),
  },
};
</script>
  
<style lang="scss" scoped></style>