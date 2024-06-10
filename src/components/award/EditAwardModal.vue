<template>
  <b-modal
    id="edit-award-modal"
    title="Award Edit Modal"
    centered
    hide-footer
    size="lg"
    @hidden="reset"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Award Edit</h2>
    </template>
    <validation-observer ref="AwardEditFormValidation">
      <b-form @submit.prevent>
        <b-form-group label-for="type">
          <template #label> Name <span class="text-danger">*</span> </template>
          <validation-provider
            #default="{ errors }"
            name="Type"
            :rules="{ required, regex: /^[A-Z\s]*$/i }"
          >
            <b-form-input
              id="type"
              v-model="type"
              :state="errors.length > 0 ? false : null"
              placeholder="Type"
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
        <b-form-group class="mt-2 text-right">
          <b-button
            type="submit"
            variant="info"
            pill
            class="mr-1"
            @click="validationForm"
          >
            Update
          </b-button>
        </b-form-group>
      </b-form>
    </validation-observer>
  </b-modal>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [util],
  props: {
    award: Object,
  },
  data() {
    return {
      required,
      type: "",
    };
  },
  async mounted() {
    if (this.award) {
      this.type = this.award.name;
    }
  },
  methods: {
    ...mapActions({
      updateAward: "appData/updateAward",
    }),
    async validationForm() {
      const success = await this.$refs.AwardEditFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.updateAward({
          payload: {
            name: this.type,
            updated_by: this.getLoggedInUser.id,
          },
          pk: this.award.id,
        });

        if (res.status === 200) {
          this.$swal({
            title: "Award updated successfully",
            icon: "success",
          });
          this.reset();
          this.$nextTick(() => {
            this.$bvModal.hide("edit-award-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        console.log("error", error);
        this.displayError(error);
      }
    },
    reset() {
      this.type = "";
    },
  },
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
  },
};
</script>
  
  <style></style>
  