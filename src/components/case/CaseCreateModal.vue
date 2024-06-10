<template>
  <b-modal
    id="case-create-modal"
    title="Case Create Modal"
    centered
    size="xl"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <h2 class="m-0">CREATE CASE</h2>
    </template>
    <b-form @submit.prevent>
      <b-tabs content-class="py-1" fill>
        <b-tab no-body>
          <template #title>
            <feather-icon
              icon="FileIcon"
              :class="detailFormState ? 'text-danger' : ''"
            />
            <span :class="detailFormState ? 'text-danger' : ''"
              >Case Detail</span
            >
          </template>
          <validation-observer ref="caseCreateDetailFormValidation">
            <CaseDetailForm
              ref="detailForm"
              :mode="modes.CREATE"
              :isOldInquiry="isOldInquiry"
              :isSubmtRequested="isSubmtRequested"
            />
          </validation-observer>
        </b-tab>
      </b-tabs>
    </b-form>
    <template #modal-footer>
      <b-form-group class="mt-1 text-right">
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

        <!-- DRAFT BUTTON -->
        <b-button
          type="submit"
          variant="info"
          pill
          class="mr-1"
          @click="DraftValidationForm"
        >
          Save
        </b-button>

        <!-- MARK BUTTON -->
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-1"
          @click="markValidationForm"
          v-if="!isOldInquiry"
        >
          Mark
        </b-button>

        <!-- MARK FOR VERIFICATION BUTTON -->
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-1"
          @click="MarkForVerificationValidationForm"
          v-if="!isOldInquiry"
        >
          Mark for Verification
        </b-button>
        
        <!-- Create Button-->
        <b-button
          type="submit"
          variant="primary"
          pill
          class="mr-1"
          @click="CreateOldInquiryValidationForm"
          v-if="isOldInquiry"
        >
          Create
        </b-button>
      </b-form-group>
    </template>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CaseDetailForm from "@/components/caseForm/CaseDetailForm.vue";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    CaseDetailForm,
  },
  props: {
    isOldInquiry: Boolean,
  },
  mixins: [util],
  data() {
    return {
      draft: false,
      detailFormState: false,
      isSubmtRequested: false,
    };
  },
  mounted() {
      console.log('isOldInquiry from create modal', this.isOldInquiry);
    },
  methods: {
    ...mapActions({
      createCase: "appData/createCase",
    }),

    // Old Inquiry
    // async CreateOldInquiryValidationForm() {
    //   this.isSubmtRequested = true;
    //   let success = await this.$refs.caseCreateDetailFormValidation.validate();
    //   if (success) {
    //     this.detailFormState = false;
    //     await this.OldInquirySubmit();
    //   } else {
    //     this.detailFormState = true;
    //   }
    // },
    // async OldInquirySubmit() {
    //   const detailForm = this.$refs.detailForm.$data;
    //   try {
    //     const users = detailForm.markedUserList.map((user) => {
    //       return user.id;
    //     });

    //     if (users.length === 0) {
    //       this.displayError("Case has to be marked");
    //       return;
    //     }

    //     // if (detailForm.comment.length > detailForm.maxCommentCount) {
    //     //     this.displayError(
    //     //         `Comment Length cannot be greater than ${detailForm.maxCommentCount}`
    //     //     );
    //     //     return;
    //     // }

    //     // const members_ids = detailForm.members.map((member) => {
    //     //   return member.id;
    //     // });
    //     // const officer_involved_ids = detailForm.officer_involved.map(
    //     //   (officer) => {
    //     //     return officer.id;
    //     //   }
    //     // );

    //     const civilian_involved_ids = detailForm.civilians.map((civ) => {
    //       return civ.id;
    //     });

    //     const individual_involved = detailForm.individual_involved.map(
    //       (officer) => {
    //         return {
    //           individual: officer.id,
    //           created_by: this.getLoggedInUser.id,
    //         };
    //       }
    //     );
    //     const codeName = "ver";
    //     console.log(detailForm.markedUserList);
    //     const userCodeName = detailForm.markedUserList[0].role_data.code_name;
    //     if (codeName != userCodeName) {
    //       this.$swal({
    //         title: "Marked User Does not have Verifier Role",
    //         icon: "error",
    //       });
    //       return;
    //     }

    //     const history = [];
    //     if (detailForm.comment) {
    //       for (let i = 0; i < users.length; i++) {
    //         const user = users[i];
    //         history.push({
    //           comment: detailForm.comment,
    //           is_private: detailForm.isPrivate,
    //           // documents_id: mark_documents_id,
    //           marked_from: this.getLoggedInUser.id,
    //           marked_to: user,
    //         });
    //       }
    //     }

    //     // const documents_id = detailForm.documents.map((document) => {
    //     //     return document.id;
    //     // });
    //     // if (detailForm.president){
    //     //   this.displayError("Marked User Does not have Verifier Role");
    //     //   return;
    //     // }

    //     const data = {
    //       brief: detailForm.brief ? detailForm.brief : "",
    //       remarks: detailForm.remarks ? detailForm.remarks : "",
    //       draft: this.draft,
    //       history: history,
    //       // documents_id: documents_id,
    //       //   status: detailForm.status ? detailForm.status.value : "",
    //       status: 1,
    //       // start_date: detailForm.start_date ? detailForm.start_date : "",
    //       // completion_date: detailForm.completion_date
    //       //   ? detailForm.completion_date
    //       //   : null,
    //       president: detailForm.president ? detailForm.president.id : null,
    //       ordered_by: detailForm.ordered_by ? detailForm.ordered_by.id : null,
    //       recom: detailForm.recom,
    //       findings: detailForm.findings,
    //       created_by: this.getLoggedInUser.id,
    //       updated_by: this.getLoggedInUser.id,
    //       noc: detailForm.noc ? detailForm.noc.id : null,
    //       individual_involved: individual_involved,
    //       civilian_involved_ids: civilian_involved_ids,
    //       unit: detailForm.unit ? detailForm.unit.id : null,
    //       formation: detailForm.formation ? detailForm.formation.id : null,
    //     };
    //     console.log("case create: ", data);
    //     const res = await this.createCase(data);
    //     console.log("res", res);
    //     if (res.status === 201) {
    //       this.$swal({
    //         title: "Case Created and Marked for Verification successfully",
    //         icon: "success",
    //       });
    //       this.$nextTick(() => {
    //         this.$bvModal.hide("case-create-modal");
    //       });
    //       this.$emit("modalClosed");
    //     }
    //   } catch (error) {
    //     console.log("error", error);
    //   }
    // },

    // Draft
    async DraftValidationForm() {
      await this.$refs.detailForm.setDraft(true);
      this.isSubmtRequested = false;
      let success = await this.$refs.caseCreateDetailFormValidation.validate();
      if (success) {
        this.detailFormState = false;
        await this.saveDraft();
      } else {
        this.detailFormState = true;
      }
    },
    async saveDraft() {
      this.draft = true;
      const detailForm = this.$refs.detailForm.$data;

      const users = detailForm.markedUserList.map((user) => {
        return user.id;
      });

      try {
        const civilian_involved_ids = detailForm.civilians.map((civ) => {
          return civ.id;
        });

        const individual_involved = detailForm.individual_involved.map(
          (officer) => {
            return {
              individual: officer.id,
              created_by: this.getLoggedInUser.id,
            };
          }
        );

        const history = [];
        // if (detailForm.comment) {
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
        // }

        const data = {
          brief: detailForm.brief ? detailForm.brief : "",
          remarks: detailForm.remarks ? detailForm.remarks : "",
          draft: this.draft,
          history: history,
          // documents_id: documents_id,
          status: detailForm.status ? detailForm.status.value : 1,
          // start_date: detailForm.start_date ? detailForm.start_date : "",
          // completion_date: detailForm.completion_date
          //   ? detailForm.completion_date
          //   : null,
          president: detailForm.president ? detailForm.president.id : null,
          ordered_by: detailForm.ordered_by ? detailForm.ordered_by.id : null,
          recom: detailForm.recom,
          findings: detailForm.findings,
          individual_involved: individual_involved,
          civilian_involved_ids: civilian_involved_ids,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
          noc: detailForm.noc ? detailForm.noc.id : null,
          unit: detailForm.unit ? detailForm.unit.id : null,
          formation: detailForm.formation ? detailForm.formation.id : null,
        };
        const res = await this.createCase(data);
        if (res.status === 201) {
          this.$swal({
            title: "Case Draft successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("case-create-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },

    // Mark For Verification
    async MarkForVerificationValidationForm() {
      this.isSubmtRequested = true;
      let success = await this.$refs.caseCreateDetailFormValidation.validate();
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

        const civilian_involved_ids = detailForm.civilians.map((civ) => {
          return civ.id;
        });

        const individual_involved = detailForm.individual_involved.map(
          (officer) => {
            return {
              individual: officer.id,
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

        // const documents_id = detailForm.documents.map((document) => {
        //     return document.id;
        // });
        // if (detailForm.president){
        //   this.displayError("Marked User Does not have Verifier Role");
        //   return;
        // }

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
        };
        console.log("case create: ", data);
        const res = await this.createCase(data);
        console.log("res", res);
        if (res.status === 201) {
          this.$swal({
            title: "Case Created and Marked for Verification successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("case-create-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        console.log("error", error);
      }
    },

    // Mark
    async markValidationForm() {
      this.isSubmtRequested = true;
      let success = await this.$refs.caseCreateDetailFormValidation.validate();
      if (success) {
        this.detailFormState = false;
        await this.markSubmit();
      } else {
        this.detailFormState = true;
      }
    },
    async markSubmit() {
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
              individual: officer.id,
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

        // const documents_id = detailForm.documents.map((document) => {
        //     return document.id;
        // });

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
        };
        console.log("case create: ", data);
        const res = await this.createCase(data);
        if (res.status === 201) {
          this.$swal({
            title: "Case Created and Marked successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("case-create-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        console.log("error", error);
      }
    },

    closeCaseModal() {
      this.$nextTick(() => {
        this.$bvModal.hide("case-create-modal");
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
  },
  computed: {
    ...mapGetters({
      getLoggedInUser: "appData/getLoggedInUser",
      hasPermission: "appData/hasPermission",
    }),
  },
};
</script>

<style lang="scss" scoped></style>
