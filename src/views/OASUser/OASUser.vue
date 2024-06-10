<template>
  <div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="7">
          <div v-if="searchType">
            <b-form-group
              label="OAS ID"
              label-for="username"
              class="w-50"
              v-if="searchType.value === 1"
            >
              <b-input-group>
                <template #prepend> </template>
              </b-input-group>
              <b-form-input
                id="username"
                v-model="username"
                @keydown="enterPressHandler"
                @input="inputHandler"
                placeholder="OAS ID"
              />
            </b-form-group>
            <b-form-group
              label="Role"
              label-for="name"
              class="w-50"
              v-if="searchType.value === 2"
            >
              <b-form-input
                id="name"
                v-model="name"
                @keydown="enterPressHandler"
                @input="inputHandler"
                placeholder="role"
              />
            </b-form-group>
            <VueSelectPaginated
              name="Formation"
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
            />
            <b-form-group
              label="User Type:"
              label-for="oas_non_oas"
              class="w-50"
              v-if="searchType.value ===4"
            >
            <b-form-radio-group 
                 v-model="oas_non_oas" 
                 :options="[{text: 'OAS', value: false}, {text: 'Non OAS', value: true}]">
            </b-form-radio-group>
            
            <b-form-input
                class="mt-1"
                id="service_number"
                v-model="svc_number"
                placeholder="Service Number (without prefix)"
                type="number"
                @keydown="enterPressHandler"
                @input="inputHandler"
              />

            </b-form-group>
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
        responsive="sm"
        :fields="fields"
        :items="users"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_user')"
        :per-page="0"
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
            variant="info"
            pill
            size="sm"
            class="mr-50"
            @click="editUser(row.item)"
            v-if="hasPermission('update_user')"
          >
            Edit
          </b-button>

          <b-button
            variant="danger"
            pill
            size="sm"
            class="mr-50"
            @click="removeUser(row.item)"
            v-if="hasPermission('update_user') && (row.item.is_non_oas)"
          >
            Delete
          </b-button>

          <!-- <b-button
              variant="danger"
              pill
              size="sm"
              class="mr-1"
              @click="editParentOrganization(row.item)"
              v-if="hasPermission('update_user')"
            >
              Set Parent Organization
            </b-button> -->
        </template>
      </b-table>
      <b-pagination
        size="md"
        :total-rows="totalItems"
        v-model="currentPage"
        :per-page="perPage"
      ></b-pagination>
    </b-card>
    <AdminEditUserModal
      :user="user"
      @modalClosed="onModalClosed"
      :key="`edit-${adminEditUserModalCount}`"
    />
    <user-edit-parent-organization-modal
      :user="user"
      @modalClosed="onModalClosed"
      :key="`edit-parent-${userEditParentOrganiztionModalCount}`"
    />
  </div>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import AdminEditUserModal from "@/components/user/AdminEditUserModal.vue";
import UserEditParentOrganizationModal from "@/components/user/UserEditParentOrganizationModal.vue";
import util from "@/util.js";

export default {
  components: {
    AdminEditUserModal,
    VueSelectPaginated,
    UserEditParentOrganizationModal,
  },
  data() {
    return {
      fields: [
        //   { key: "name", label: "Name" },
        { key: "username", label: "OAS ID" },
        { key: "svc_number", label: "Svc No" },
        { key: "appointment_name", label: "Appointment" },
        { key: "organization_data", label: "Formation" },
        { key: "role_data", label: "Role" },

        { key: "manage", label: "Manage" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      users: [],
      user: null,
      adminEditUserModalCount: 0,
      userEditParentOrganiztionModalCount: 0,
      searchTypes: [
        { value: 1, name: "OAS ID" },
        { value: 2, name: "Role" },
        { value: 3, name: "Formation" },
        { value: 4, name: "User Type" },
      ],
      searchType: null,
      name: "",
      username: "",
      organization: null,
      oas_non_oas:null,
      svc_number: null,
    };
  },
  mixins: [util],
  created() {
    this.searchType = this.searchTypes[0];
  },
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getUsers: "appData/getUsers",
      getOrganizations: "appData/getOrganizations",
      deleteUser: "appData/deleteUser",
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
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.name = "";
            this.organization = null;
            this.oas_non_oas = "";
            break;
          case 2:
            this.username = "";
            this.organization = null;
            this.oas_non_oas = "";
            break;
          case 3:
            this.name = "";
            this.username = "";
            this.oas_non_oas = "";
            break;
          case 4:
            this.name = "";
            this.username = "";
            this.organization = null;
            break;
        }
      } else {
        this.name = "";
        this.username = "";
        this.organization = "";
        this.oas_non_oas = "";
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getUsers({
          pageNumber: this.currentPage,
          role_name: this.name,
          username: this.username,
          organization: this.organization ? this.organization.id : null,
          oas_non_oas: this.oas_non_oas,
          svc_number: this.svc_number,
        });
        this.users = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    editUser(user) {
      this.user = user;
      this.adminEditUserModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("admin-edit-user-modal");
      });
    },

    editParentOrganization(user) {
      this.user = user;
      this.userEditParentOrganiztionModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("user-edit-parent-organization-modal");
      });
    },

    async removeUser(item) {
      this.item = item;
      try {
        this.$swal({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ml-1",
          },
          buttonsStyling: false,
        }).then(async (result) => {
          if (result.value) {
            const res = await this.deleteUser({
              pk: this.item.id,
            });
            if (res.status === 204) {
              this.$swal({
                icon: "success",
                title: "Deleted!",
                text: "User has been deleted.",
                customClass: {
                  confirmButton: "btn btn-success",
                },
              });
              if (
                (this.totalItems - 1) % this.perPage === 0 &&
                this.currentPage !== 1
              ) {
                this.currentPage -= 1;
              } else {
                await this.fetchPaginatedData();
              }
            }
          }
        });
      } catch (error) {
        this.displayError(error);
      }
    },
    async onModalClosed() {
      await this.fetchPaginatedData();
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>
  
  <style></style>
  