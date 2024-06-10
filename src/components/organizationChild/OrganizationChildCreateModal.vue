<template>
  <b-modal
    id="organization-child-create-modal"
    title="Organization Child Create Modal"
    centered
    hide-footer
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Organization Child Create</h2>
    </template>
    <validation-observer ref="organizationChildCreateFormValidation">
      <b-form @submit.prevent>
        <b-row>
          <b-col md="6">
            <VueSelectPaginated
              name="Organization"
              label="name"
              :rules="{ required: true }"
              :prevSelected="organization"
              :getListMethod="getOrganizations"
              @setMethod="(value) => (organization = value)"
              searchBy="name"
            />
          </b-col>
          <b-col md="6">
            <VueSelectPaginated
              name="Organization Children"
              label="name"
              :multiple="true"
              :optionLabel="(getFilter) => getFilter.name"
              :prevSelected="organizationList"
              :getListMethod="getOrganizations"
              @setMethod="(value) => (organizationList = value)"
              :filter="organization"
              searchBy="name"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <validation-provider
              #default="{ errors }"
              name="Level"
              rules="required"
            >
              <b-form-group
                label-for="level"
                :state="errors.length > 0 ? false : null"
              >
                <template #label>
                  Level
                  <span class="text-danger">*</span>
                </template>
                <v-select
                  id="level"
                  v-model="organizationLevel"
                  :options="organizationLevels"
                  placeholder="Level"
                  label="name"
                />
                <b-form-invalid-feedback
                  :state="errors.length > 0 ? false : null"
                >
                  {{ errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
          </b-col>
        </b-row>
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
        </b-form-group>
      </b-form>
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
  },
  mixins: [util],
  data() {
    return {
      required,
      organization: null,
      organizationList: [],
      organizationLevel: null,
    };
  },
  methods: {
    ...mapActions({
      getOrganizations: "appData/getOrganizations",
      createOrganizationChild: "appData/createOrganizationChild",
    }),
    async validationForm() {
      const success =
        await this.$refs.organizationChildCreateFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const data = this.organizationList.map((org) => {
          return {
            parent: this.organization.id,
            child: org.id,
            level: this.organizationLevel.value,
            created_by: this.getLoggedInUser.id,
          };
        });

        const res = await this.createOrganizationChild(data);
        if (res.status === 201) {
          this.$swal({
            title: "Organization Children created successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("organization-child-create-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },
  },
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
  },
};
</script>

<style></style>
