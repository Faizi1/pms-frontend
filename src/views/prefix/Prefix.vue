<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        variant="primary"
        pill
        @click="createPrefix"
        v-if="hasPermission('create_prefix')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-table
        responsive="sm"
        :fields="fields"
        :items="prefixes"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_prefix')"
        :per-page="0"
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
            row.item.created_by_data
              ? `${row.item.created_by_data.appointment_name} -
                      ${row.item.created_by_data.name}`
              : ""
          }}
        </template>
        <template #cell(updated_by_data)="row">
          {{
            row.item.updated_by_data
              ? `${row.item.updated_by_data.appointment_name} -
                      ${row.item.updated_by_data.name}`
              : ""
          }}
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-1"
            @click="editPrefix(row.item)"
            v-if="hasPermission('update_prefix')"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removePrefix(row.item)"
            v-if="hasPermission('delete_prefix')"
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
      ></b-pagination>
      <!-- <span class="mt-1 bg1 float-right" >Total Rows: {{ rows }}</span> -->
    </b-card>
    <prefix-create-modal
      @modalClosed="onModalClosed"
      :key="`create-${prefixCreateModalCount}`"
    />
    <prefix-edit-modal
      :prefix="prefix"
      @modalClosed="onModalClosed"
      :key="`edit-${prefixEditModalCount}`"
    />
  </div>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import PrefixCreateModal from "@/components/prefix/PrefixCreateModal.vue";
import PrefixEditModal from "@/components/prefix/PrefixEditModal.vue";
import util from "@/util.js";

export default {
  components: {
    PrefixCreateModal,
    PrefixEditModal,
  },
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "id", label: "Id" },
        { key: "name", label: "Name" },
        { key: "created_at", label: "Created At" },
        { key: "created_by_data", label: "Created By" },
        { key: "updated_at", label: "Created At" },
        { key: "updated_by_data", label: "Updated By" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      prefixes: [],
      prefix: null,
      prefixCreateModalCount: 0,
      prefixEditModalCount: 0,
    };
  },
  mixins: [util],
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getPrefixes: "appData/getPrefixes",
      deletePrefix: "appData/deletePrefix",
    }),
    async fetchPaginatedData() {
      try {
        const res = await this.getPrefixes({
          pageNumber: this.currentPage,
        });
        this.prefixes = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createPrefix() {
      this.prefixCreateModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("prefix-create-modal");
      });
    },
    editPrefix(prefix) {
      this.prefix = prefix;
      this.prefixEditModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("prefix-edit-modal");
      });
    },
    async removePrefix(prefix) {
      this.prefix = prefix;
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
          const res = await this.deletePrefix({
          pk: this.prefix.id,
          });
          if (res.status === 204) {
            this.$swal({
              title: "Prefix deleted successfully",
              icon: "success",
              text: "Prefix has been deleted.",
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
    rows() {
      return this.prefixes.length;
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
  
  