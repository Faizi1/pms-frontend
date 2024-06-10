<template>
  <b-modal
    :id="id"
    title="Member Create Modal"
    centered
    hide-footer
    size="lg"
    @hidden="reset"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">ADD</h2>
    </template>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="7">
          <div v-if="searchType">
            <!-- <b-form-group
              label="Name"
              label-for="name"
              class="w-50"
              v-if="searchType.value === 1"
            >
              <b-input-group>
                <template #prepend> </template>
              </b-input-group>
              <b-form-input 
                  id="name" 
                  v-model="name" 
                  placeholder="Name"
                  @keydown="enterPressHandler"
                  @input="inputHandler"
                   />
            </b-form-group> -->
            <b-form-group
              label="OAS ID"
              label-for="username"
              class="w-50"
              v-if="searchType.value === 2"
            >
              <b-form-input
                id="username"
                v-model="username"
                placeholder="OAS ID"
                @keydown="enterPressHandler"
                @input="inputHandler"
              />
            </b-form-group>
            <!-- <VueSelectPaginated
              name="Organization"
              label="name"
              searchBy="name"
              :prevSelected="organization"
              :getListMethod="getOrganizations"
              customClass="w-50"
              @setMethod="
                (value) => {
                  organization = value;
                }
              "
              @input="inputHandlerValSelected"
              v-if="searchType.value === 3"
            /> -->
            <b-form-group
              label="Service Number: (without prefix)"
              label-for="service_number"
              class="w-50"
              v-if="searchType.value === 4"
            >
              <b-form-input
                id="service_number"
                v-model="svc_number"
                placeholder="Example: 2124"
                type="number"
                @keydown="enterPressHandler"
                @input="inputHandler"
              />
            </b-form-group>

            <!-- <b-form-group
              label="User Type:"
              label-for="oas_non_oas"
              class="w-50"
              v-if="searchType.value === 5"
            >
            <b-form-radio-group 
                 v-model="oas_non_oas" 
                 :options="[{text: 'OAS', value: false}, {text: 'Non OAS', value: true}]">
            </b-form-radio-group>
            </b-form-group> -->
          </div>
        </b-col>
        <b-col md="3">
          <b-form-group label="Search Type" label-for="searchType">
            <v-select
              id="searchType"
              v-model="searchType"
              :options="searchTypes"
              placeholder="Search Type"
              label="name"
            />
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-button variant="primary" pill @click="search">
            <feather-icon icon="SearchIcon" class="mr-50" />
            <span class="align-middle">Search</span>
          </b-button>
        </b-col>
      </b-row>
      <b-table
        :fields="fields"
        :items="members"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_member')"
        :per-page="0"
        responsive
        table-class="w-100"
      >
        <template #cell(created_by_data)="row">
          {{
            row.item.created_by_data ? row.item.created_by_data.username : ""
          }}
        </template>
        <template #cell(updated_by_data)="row">
          {{
            row.item.updated_by_data ? row.item.updated_by_data.username : ""
          }}
        </template>
        <template #cell(role_data)="row">
          {{ row.item.role_data ? row.item.role_data.name : "" }}
        </template>
        <template #cell(organization_data)="row">
          {{
            row.item.organization_data ? row.item.organization_data.name : ""
          }}
        </template>
        <template #custom-foot>
          <b-tr variant="light">
            <b-td :colspan="fields.length">
              <span class="font-weight-bolder"
                >Total Rows: {{ totalItems }}</span
              >
            </b-td>
          </b-tr>
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="success"
            pill
            class="mr-50"
            size="sm"
            @click="addPerson(row.item)"
            v-if="hasPermission('read_case')"
          >
            Add
          </b-button>
        </template>
      </b-table>
      <b-pagination
        size="md"
        :total-rows="totalItems"
        v-model="currentPage"
        :per-page="perPage"
        class="d-flex justify-content-center"
      ></b-pagination>
    </b-card>
    <b-form>
      <b-form-group class="mt-2 text-right">
        <!-- v-if = "type=== 4" available for on individaul,  -->
        <b-button variant="primary" pill class="mr-1" @click="createNonOasUser" v-b-tooltip.hover title="NON OAS Users">
          ADD NON OAS Users
        </b-button>
      </b-form-group>
    </b-form>
    <create-user-modal
      :key="`create${createUserModalCount}`"
    />
    <!-- <validation-observer ref="memberCreateFormValidation">
      <b-form @submit.prevent>
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
    </validation-observer> -->
  </b-modal>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import { required } from "@validations";
import util from "@/util.js";
import CreateUserModal from "@/components/user/CreateUserModal.vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
    CreateUserModal,
  },
  props: {
    type: Number,
    id: {
      type: String,
      default: "member-create-modal",
    },
    editMode: Boolean,
  },
  mixins: [util],
  data() {
    return {
      required,
      army_no: "",
      prefix: null,
      rank: null,
      name: "",
      parent_unit: "",
      unit_comd: "",
      course: "",
      search_prefix: null,
      search_army_no: "",
      members: [],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      fields: [
        { key: "name", label: "Name" },
        { key: "username", label: "OAS ID" },
        { key: "svc_number", label: "Svc No" },
        { key: "rank_name", label: "Rank" },
        { key: "appointment_name", label: "Appointment" },
        { key: "role_data", label: "Role" },
        { key: "organization_data", label: "Organization" },
        { key: "manage", label: "Manage" },
      ],
      searchTypes: [
        // { value: 1, name: "Name" },
        { value: 2, name: "OAS ID" },
        // { value: 3, name: "Organization" },
        { value: 4, name: "Service No" },
        // { value: 5, name: "User Type" },
      ],
      searchType: null,
      name: "",
      username: "",
      organization: null,
      svc_number: null,
      oas_non_oas:null,
      createUserModalCount: 0, 
    };
  },
  mounted() {
    // console.log(this.id);
  },
  methods: {
    ...mapActions({
      createMember: "appData/createMember",
      getPrefixes: "appData/getPrefixes",
      getRankTypes: "appData/getRankTypes",
      getMembers: "appData/getMembers",
      getUsers: "appData/getUsers",
      getOrganizations: "appData/getOrganizations",
    }),

    enterPressHandler(e) {
      if (e.code === "Enter" || e.code === "NumpadEnter") this.search();
    },

    inputHandler(val) {
      if (val === "" || !val) this.search();
    },
    inputHandlerValSelected(val) {
      if (val) this.search();
    },

    createNonOasUser() {
      // this.createCivilianModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-user-modal");
      });
    },
    async validationForm() {
      const success = await this.$refs.memberCreateFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.username = "";
            // this.organization = null;
            // this.svc_number = "";
            // this.oas_non_oas = "";
            break;
          case 2:
            // this.name = "";
            // this.organization = null;
            this.svc_number = "";
            // this.oas_non_oas = "";
            break;
          // case 3:
          //   this.name = "";
          //   this.username = "";
          //   this.svc_number = "";
          //   this.oas_non_oas = "";
          //   break;
          // case 4:
          //   this.name = "";
          //   this.username = "";
          //   this.organization = null;
          //   this.oas_non_oas = "";
          // case 5:
          //   this.name = "";
          //   this.username = "";
          //   this.organization = null;
          //   this.svc_number = "";
          //   break;
        }
      } else {
        this.name = "";
        this.username = "";
        this.organization = "";
        this.svc_number = "";
        this.oas_non_oas = "";
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getUsers({
          pageNumber: this.currentPage,
          name: this.name,
          username: this.username,
          organization: this.organization ? this.organization.id : null,
          svc_number: this.svc_number,
          oas_non_oas: this.oas_non_oas,
        });
        this.members = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    async submit() {
      try {
        const res = await this.createMember({
          name: this.name,
          army_no: this.army_no,
          army_prefix: this.prefix ? this.prefix.id : "",
          rank: this.rank ? this.rank.id : "",
          course: this.course,
          parent_unit: this.parent_unit,
          unit_comd: this.unit_comd,
          created_by: this.getLoggedInUser.id,
        });
        if (res.status === 201) {
          this.$swal({
            title: "Member created successfully",
            icon: "success",
          });
          this.addPerson(res.data);
          this.reset();
          this.$nextTick(() => {
            this.$bvModal.hide("member-create-modal");
          });
          this.$emit("modalClosed");
        }
      } catch (error) {
        this.displayError(error);
      }
    },
    addPerson(item) {
      if (this.type === 1) {
        if(this.editMode){
          item['editMode'] = true
        }
        console.log('item', item);
        this.$emit("addPresident", item);
        this.$nextTick(() => {
          this.$bvModal.hide("member-create-modal");
        });
        this.$emit("modalClosed");
      } else if (this.type === 2) {
        if(this.editMode){
          item['editMode'] = true
        }
        this.$emit("addOrderedBy", item);
        this.$nextTick(() => {
          this.$bvModal.hide("member-create-modal");
        });
        this.$emit("modalClosed");
      } else if (this.type === 3) {
        this.$emit("addMember", item);
        this.$nextTick(() => {
          this.$bvModal.hide("member-create-modal");
        });
        this.$emit("modalClosed");
      } else if (this.type === 4) {
        this.$emit("addOfficerInvolved", item);
        this.$nextTick(() => {
          this.$bvModal.hide("member-create-modal");
        });
        this.$emit("modalClosed");
      } else if (this.type === 5) {
        this.$emit("linkedIndividual", item);
        this.$nextTick(() => {
          this.$bvModal.hide("member-create-modal");
        });
        this.$emit("modalClosed");
      }
    },
    reset() {},
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
    oas_non_oas: function (val) {
      console.log("oas_non_oas value changed:", val);
    },
  },
};
</script>
  
  <style></style>
  