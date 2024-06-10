<template>
  <b-modal
    id="organization-child-edit-modal"
    title="Organization Child Edit Modal"
    centered
    hide-footer
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Organization Child Edit</h2>
    </template>
    <validation-observer ref="organizationChildEditFormValidation">
      <b-form @submit.prevent>
        <b-row>
          <b-col md="6">
            <VueSelectPaginated
              name="Organization"
              label="name"
              :rules="{ required: true }"
              :disabled="true"
              :prevSelected="organization"
              :getListMethod="getOrganizations"
              @setMethod="(value) => (petition = value)"
              searchBy="name"
            />
          </b-col>
          <b-col md="6">
            <VueSelectPaginated
              name="Organization Children"
              label="name"
              :optionLabel="(getFilter) => getFilter.name"
              :prevSelected="organizationChild"
              :getListMethod="getOrganizations"
              @setMethod="(value) => (organizationChild = value)"
              :filter="organization"
              searchBy="name"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <v-select
              id="level"
              v-model="organizationLevel"
              :options="organizationLevels"
              placeholder="Level"
              label="name"
            />
          </b-col>
        </b-row>
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
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
  },
  props: {
    organizationChildProp: Object,
  },
  mixins: [util],
  mounted() {
    if (this.organizationChildProp) {
      this.organization = this.organizationChildProp.parent_data;
      this.organizationChild = this.organizationChildProp.child_data;
      this.organizationLevel = this.organizationLevels.find(
        (level) => level.value === this.organizationChildProp.level
      );
    }
  },
  data() {
    return {
      required,
      organization: null,
      organizationChild: [],
      organizationLevel: null,
    };
  },
  methods: {
    ...mapActions({
      getOrganizations: "appData/getOrganizations",
      updateOrganizationChild: "appData/updateOrganizationChild",
    }),
    async validationForm() {
      const success =
        await this.$refs.organizationChildEditFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const data = {
          parent: this.organization.id,
          child: this.organizationChild.id,
          level: this.organizationLevel.value,
          updated_by: this.getLoggedInUser.id,
        };

        const res = await this.updateOrganizationChild({
          payload: data,
          pk: this.organizationChildProp.id,
        });
        if (res.status === 200) {
          this.$swal({
            title: "Organization child updated successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("organization-child-edit-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        console.log(error);
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
