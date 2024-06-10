<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        variant="primary"
        pill
        @click="createNoc"
        v-if="hasPermission('create_noc')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-table
        responsive="sm"
        :fields="fields"
        :items="formattedNocs"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_noc')"
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
            @click="editNoc(row.item)"
            v-if="hasPermission('update_noc')"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeNoc(row.item)"
            v-if="hasPermission('delete_noc')"
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
    </b-card>
    <CreateNocModal
      @modalClosed="onModalClosed"
      :key="`create-${createNocModalCount}`"
    />
    <EditNocModalVue
      @modalClosed="onModalClosed"
      :noc="noc"
      :key="`edit-${editNocModalCount}`"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CreateNocModal from "@/components/noc/CreateNocModal.vue";
import EditNocModalVue from "@/components/noc/EditNocModal.vue";

export default {
  components: {
    CreateNocModal,
    EditNocModalVue,
  },
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "id", label: "Id" },
        { key: "name", label: "Name" },
        { key: "duration", label: "Duration" },
        { key: "created_at", label: "Created At" },
        { key: "created_by_data", label: "Created By" },
        { key: "updated_at", label: "Updated At" },
        { key: "updated_by_data", label: "Updated By" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      nocs: [],
      noc: null,
      name: "",
      createNocModalCount: 0,
      editNocModalCount: 0,
    };
  },
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getNocs: "appData/getNocs",
      deleteNoc: "appData/deleteNoc",
    }),
    async fetchPaginatedData() {
      try {
        const res = await this.getNocs({
          pageNumber: this.currentPage,
          name: this.name,
        });
        this.nocs = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createNoc() {
      this.createNocModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-noc-modal");
      });
    },
    editNoc(noc) {
      this.noc = noc;
      this.editNocModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-noc-modal");
      });
    },
    async removeNoc(noc) {
      this.noc = noc;
      try {
        const res = await this.deleteNoc({
          pk: this.noc.id,
        });
        if (res.status === 204) {
          this.$swal({
            title: "NOC deleted successfully",
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
    }),
    formattedNocs() {
      return this.nocs.map((noc) => ({
        ...noc,
        duration:
          noc.duration === 1 ? `${noc.duration} week` : `${noc.duration} weeks`,
      }));
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
</style>