<template>
  <b-modal
    id="edit-noc-modal"
    title="NOC Edit Modal"
    centered
    hide-footer
    size="lg"
    @hidden="reset"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">NOC Edit</h2>
    </template>
    <validation-observer ref="NocEditFormValidation">
      <b-form @submit.prevent>
        <b-form-group label-for="name">
          <template #label> Name <span class="text-danger">*</span> </template>
          <validation-provider
            #default="{ errors }"
            name="Name"
            :rules="{ required, regex: /^[A-Z\s]*$/i }"
          >
            <b-form-input
              id="name"
              v-model="name"
              :state="errors.length > 0 ? false : null"
              placeholder="Name"
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>

        <b-form-group label-for="duration">
          <template #label>
            Duration <span class="text-danger">*</span>
          </template>
          <validation-provider
            #default="{ errors }"
            name="duration"
            :rules="{ regex: /^[0-9]*$/i }"
          >
            <b-form-input
              id="duration"
              v-model="duration"
              :state="errors.length > 0 ? false : null"
              placeholder="0"
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
    noc: Object,
  },
  data() {
    return {
      required,
      name: "",
      duration: "",
    };
  },
  async mounted() {
    if (this.noc) {
      this.name = this.noc.name;
      this.duration = parseInt(this.noc.duration); // Convert to integer
    }
  },
  methods: {
    ...mapActions({
      updateNoc: "appData/updateNoc",
    }),
    async validationForm() {
      const success = await this.$refs.NocEditFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.updateNoc({
          payload: {
            name: this.name,
            duration: this.duration,
            updated_by: this.getLoggedInUser.id,
          },
          pk: this.noc.id,
        });

        if (res.status === 200) {
          this.$swal({
            title: "NOC updated successfully",
            icon: "success",
          });
          this.reset();
          this.$nextTick(() => {
            this.$bvModal.hide("edit-noc-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        console.log("error", error);
        this.displayError(error);
      }
    },
    reset() {
      this.name = "";
      this.duration = "";
    },
  },
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
  },
};
</script>
  
  <style></style>
  