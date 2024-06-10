<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        variant="primary"
        pill
        @click="createOrganizationChild"
        v-if="hasPermission('organization_child_create')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="5">
          <b-form-group label="Parent Name" label-for="parentName">
            <b-form-input
              id="parentName"
              v-model="parentName"
              placeholder="Parent Name"
            />
          </b-form-group>
        </b-col>
        <b-col md="5">
          <b-form-group label="Child Name" label-for="childName">
            <b-form-input
              id="childName"
              v-model="childName"
              placeholder="Child Name"
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
        :items="organizationChildren"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('organization_child_read')"
        :per-page="0"
        responsive
        table-class="w-100"
      >
        <template #custom-foot>
          <b-tr variant="light">
            <b-td :colspan="fields.length">
              <span class="font-weight-bolder"
                >Total Rows: {{ totalItems }}</span
              >
            </b-td>
          </b-tr>
        </template>
        <template #cell(created_at)="row">
          {{ getDateString(row.item.created_at) }}
        </template>
        <template #cell(updated_at)="row">
          {{ getDateString(row.item.updated_at) }}
        </template>
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
        <template #cell(level)="row">
          {{ levelName(row.item.level) }}
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-50"
            @click="editOrganizationChild(row.item)"
            v-if="hasPermission('organization_child_update')"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeOrganizationChild(row.item)"
            v-if="hasPermission('organization_child_delete')"
          >
            Delete
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
      <!-- <span class="mt-1 bg1 float-right" >Total Rows: {{ rows }}</span> -->
    </b-card>
    <organization-child-create-modal
      @modalClosed="onModalClosed"
      :key="`create-${organizationChildCreateModalCount}`"
    />
    <organization-child-edit-modal
      :organizationChildProp="organizationChild"
      @modalClosed="onModalClosed"
      :key="`edit-${organizationChildEditModalCount}`"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import OrganizationChildCreateModal from "@/components/organizationChild/OrganizationChildCreateModal.vue";
import OrganizationChildEditModal from "@/components/organizationChild/OrganizationChildEditModal.vue";
import util from "@/util.js";

export default {
  components: {
    OrganizationChildCreateModal,
    OrganizationChildEditModal,
  },
  mixins: [util],
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "parent_data.name", label: "Parent" },
        { key: "child_data.name", label: "Child" },
        { key: "level", label: "Level" },
        { key: "created_at", label: "Created At" },
        { key: "created_by_data", label: "Created By" },
        { key: "updated_at", label: "Updated At" },
        { key: "updated_by_data", label: "Updated By" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      organizationChildren: [],
      organizationChild: null,
      organizationChildCreateModalCount: 0,
      organizationChildEditModalCount: 0,
      parentName: "",
      childName: "",
    };
  },
  async mounted() {
    try {
      await this.fetchPaginatedData();
    } catch (error) {
      this.displayError(error);
    }
  },
  methods: {
    ...mapActions({
      getOrganizationChildren: "appData/getOrganizationChildren",
      deleteOrganizationChild: "appData/deleteOrganizationChild",
    }),
    async search() {
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getOrganizationChildren({
          pageNumber: this.currentPage,
          parent_name: this.parentName,
          child_name: this.childName,
        });
        this.organizationChildren = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createOrganizationChild() {
      this.organizationChildCreateModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("organization-child-create-modal");
      });
    },
    editOrganizationChild(organizationChild) {
      this.organizationChild = organizationChild;
      this.organizationChildEditModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("organization-child-edit-modal");
      });
    },
    async removeOrganizationChild(organizationChild) {
      this.organizationChild = organizationChild;
      try {
        const res = await this.deleteOrganizationChild({
          pk: this.organizationChild.id,
        });
        if (res.status === 204) {
          this.$swal({
            title: "Organization child deleted successfully",
            icon: "success",
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
      getLoggedInUser: "appData/getLoggedInUser",
    }),
    rows() {
      return this.organizationChildren.length;
    },
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>

<style>
.bg1 {
  color: red;
  font-weight: normal;
}
</style>

