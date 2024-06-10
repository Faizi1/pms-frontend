<template>
  <b-modal
    id="create-civilian-modal"
    centered
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <h2 class="m-0 text-primary">Create Civilian</h2>
    </template>
    <validation-observer ref="createAwardFormValidation">
      <b-form @submit.prevent>
        <b-form-row>
          <b-col md="6">
            <b-form-group label-for="name">
              <template #label>
                Name <span class="text-danger">*</span>
              </template>
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
          </b-col>

          <b-col md="6">
            <b-form-group label="CNIC" label-for="cnic">
              <validation-provider
                #default="{ errors }"
                name="cnic"
                :rules="{ required, regex: /^[0-9]+$/ }"
              >
                <b-form-input
                  id="cnic"
                  v-model="cnic"
                  placeholder="cnic"
                  maxlength="13"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-form>
    </validation-observer>
    <template #modal-footer>
      <b-form-group class="text-right">
        <b-button type="submit" variant="primary" pill @click="validationForm">
          Submit
        </b-button>
      </b-form-group>
    </template>
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
      name: "",
      cnic: "",
      availablePermissionSearch: "",
      allowedPermissionSearch: "",
      required,
      availablePermissionList: [],
      allowedPermissionList: [],
    };
  },
  async mounted() {
    try {
      const res = await this.getPermissions();
      this.availablePermissionList = res.data;
    } catch (error) {
      this.displayError(error);
    }
  },
  methods: {
    ...mapActions({
      createCivilain: "appData/createCivilian",
      getPermissions: "appData/getPermissions",
    }),
    async validationForm() {
      const success = await this.$refs.createAwardFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      try {
        const permissions_id = this.allowedPermissionList.map((permission) => {
          return permission.id;
        });

        const res = await this.createCivilain({
          name: this.name,
          cnic: this.cnic,
          permissions: this.allowedPermissionList,
          permissions_id,
          created_by: this.getLoggedInUser.id,
          updated_by: this.getLoggedInUser.id,
        });
        if (res.status === 201) {
          this.$swal({
            title: "Civilian created successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide("create-civilian-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },
    changePermission(permission, isAdd) {
      if (isAdd) {
        this.availablePermissionList = this.availablePermissionList.filter(
          (perm) => perm.id !== permission.id
        );
        this.allowedPermissionList.push(permission);
        this.allowedPermissionList.sort((a, b) => {
          return a.id - b.id;
        });
      } else {
        this.allowedPermissionList = this.allowedPermissionList.filter(
          (perm) => perm.id !== permission.id
        );
        this.availablePermissionList.push(permission);
        this.availablePermissionList.sort((a, b) => {
          return a.id - b.id;
        });
      }
    },
  },
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
    filterAvailablePermissionByName: function () {
      return this.availablePermissionList.filter(
        (permission) =>
          !permission.name
            .toLowerCase()
            .indexOf(this.availablePermissionSearch.toLowerCase())
      );
    },
    filterAllowedPermissionByName: function () {
      return this.allowedPermissionList.filter(
        (permission) =>
          !permission.name
            .toLowerCase()
            .indexOf(this.allowedPermissionSearch.toLowerCase())
      );
    },
  },
};
</script>
  
  <style scoped>
.scroll-area-size {
  height: 45vh;
}

.scroll-area-size ul {
  height: 100%;
}
</style>
  