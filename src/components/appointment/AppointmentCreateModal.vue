<template>
  <b-modal
    id="appointment-create-modal"
    title="Appointment Create Modal"
    centered
    hide-footer
    size="lg"
    @hidden="reset"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Appointment Create</h2>
    </template>
    <validation-observer ref="appointmentCreateFormValidation">
      <b-form @submit.prevent>
        <b-form-group label-for="type">
          <template #label> Type <span class="text-danger">*</span> </template>
          <validation-provider
            #default="{ errors }"
            name="Type"
            :rules="{ required, regex: /^[A-Z0-9\-s]*$/i }"
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
            variant="primary"
            pill
            class="mr-1"
            @click="validationForm"
          >
            Save
          </b-button>
          <b-button
            type="reset"
            variant="outline-secondary"
            @click="reset"
            pill
          >
            Reset
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
  data() {
    return {
      required,
      type: "",
    };
  },
  methods: {
    ...mapActions({
      createAppointment: "appData/createAppointment",
    }),
    async validationForm() {
      const success = await this.$refs.appointmentCreateFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.createAppointment({
          name: this.type,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
        });
        if (res.status === 201) {
          this.$swal({
            title: "Appointment created successfully",
            icon: "success",
          });
          this.reset();
          this.$nextTick(() => {
            this.$bvModal.hide("appointment-create-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
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
  