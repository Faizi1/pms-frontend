<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        variant="primary"
        pill
        @click="createAward"
        v-if="hasPermission('create_award')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-table
        responsive="sm"
        :fields="fields"
        :items="awards"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_award')"
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
            @click="editAward(row.item)"
            v-if="hasPermission('update_award')"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeAward(row.item)"
            v-if="hasPermission('delete_award')"
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
    <CreateAwardModal
      @modalClosed="onModalClosed"
      :key="`create-${createAwardModalCount}`"
    />
    <EditAwardModalVue
      @modalClosed="onModalClosed"
      :award="award"
      :key="`edit-${editAwardModalCount}`"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CreateAwardModal from "@/components/award/CreateAwardModal.vue";
import EditAwardModalVue from "@/components/award/EditAwardModal.vue";

export default {
  components: {
    CreateAwardModal,
    EditAwardModalVue,
  },
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "id", label: "Id" },
        { key: "name", label: "Name" },
        { key: "created_at", label: "Created At" },
        { key: "created_by_data", label: "Created By" },
        { key: "updated_at", label: "Updated At" },
        { key: "updated_by_data", label: "Updated By" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      awards: [],
      award: null,
      name: "",
      createAwardModalCount: 0,
      editAwardModalCount: 0,
    };
  },
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getAwards: "appData/getAwards",
      deleteAward: "appData/deleteAward",
    }),
    async fetchPaginatedData() {
      try {
        const res = await this.getAwards({
          pageNumber: this.currentPage,
          name: this.name,
        });
        this.awards = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createAward() {
      this.createAwardModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-award-modal");
      });
    },
    editAward(award) {
      this.award = award;
      console.log(this.award);
      this.editAwardModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-award-modal");
      });
    },
    async removeAward(award) {
      this.award = award;
      try {
        const res = await this.deleteAward({
          pk: this.award.id,
        });
        if (res.status === 204) {
          this.$swal({
            title: "Award deleted successfully",
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