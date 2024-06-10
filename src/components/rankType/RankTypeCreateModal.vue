<template>
  <b-modal
    id="rank-type-create-modal"
    title="Rank Type Create Modal"
    centered
    hide-footer
    size="lg"
    @hidden="reset"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Rank Create</h2>
    </template>
    <validation-observer ref="rankTypeCreateFormValidation">
      <b-form @submit.prevent>
        <b-form-group label-for="type">
          <template #label> Type <span class="text-danger">*</span> </template>
          <validation-provider
            #default="{ errors }"
            name="Type"
            :rules="{ required, regex: /^[-/A-Z0-9\s]*$/i }"
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
        <!-- <validation-provider
          #default="{ errors }"
          name="Category"
          rules="required"
        >
          <b-form-group
            label-for="category"
            :state="errors.length > 0 ? false : null"
          >
            <template #label>
              Category <span class="text-danger">*</span>
            </template>
            <b-row>
              <b-col>
                <v-select
                  id="category"
                  v-model="category"
                  :options="rankCategories"
                  placeholder="Category"
                  label="text"
                  class="v-style-chooser"
                />
              </b-col>
            </b-row>
            <b-form-invalid-feedback :state="errors.length > 0 ? false : null">
              {{ errors[0] }}
            </b-form-invalid-feedback>
          </b-form-group>
        </validation-provider> -->
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
      // category: null,
    };
  },
  methods: {
    ...mapActions({
      createRankType: "appData/createRankType",
    }),
    async validationForm() {
      const success = await this.$refs.rankTypeCreateFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const res = await this.createRankType({
          name: this.type,
          // category: this.category.value,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
        });
        if (res.status === 201) {
          this.$swal({
            title: "Rank created successfully",
            icon: "success",
          });
          this.reset();
          this.$nextTick(() => {
            this.$bvModal.hide("rank-type-create-modal");
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
