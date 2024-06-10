<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        class="mr-50"
        variant="success"
        pill
        @click="addRanksFromUserAPI"
        v-if="hasPermission('create_rank_type')"
        v-b-tooltip.hover="'Get ranks from Users API'"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Sync</span>
      </b-button>

      <b-button
        variant="primary"
        pill
        @click="createRankType"
        v-if="hasPermission('create_rank_type')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-table
        responsive="sm"
        :fields="fields"
        :items="rankTypes"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_rank_type')"
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
            row.item.created_by_data ? row.item.created_by_data.username : ""
          }}
        </template>
        <template #cell(updated_by_data)="row">
          {{
            row.item.updated_by_data ? row.item.updated_by_data.username : ""
          }}
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-1"
            @click="editRankType(row.item)"
            v-if="hasPermission('update_rank_type')"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeRankType(row.item)"
            v-if="hasPermission('delete_rank_type')"
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
    <rank-type-create-modal
      @modalClosed="onModalClosed"
      :key="`create-${rankTypeCreateModalCount}`"
    />
    <rank-type-edit-modal
      :rankType="rankType"
      @modalClosed="onModalClosed"
      :key="`edit-${rankTypeEditModalCount}`"
    />
    <b-overlay :show="show" variant="white" spinner-variant="primary" no-wrap />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import RankTypeCreateModal from "@/components/rankType/RankTypeCreateModal.vue";
import RankTypeEditModal from "@/components/rankType/RankTypeEditModal.vue";
import util from "@/util.js";

export default {
  components: {
    RankTypeCreateModal,
    RankTypeEditModal,
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
      rankTypes: [],
      rankType: null,
      rankTypeCreateModalCount: 0,
      rankTypeEditModalCount: 0,
      show: false,
    };
  },
  mixins: [util],
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getRankTypes: "appData/getRankTypes",
      deleteRankType: "appData/deleteRankType",
      getRankFromUserAPI: "appData/getRankFromUserAPI",

    }),
    async fetchPaginatedData() {
      try {
        const res = await this.getRankTypes({
          pageNumber: this.currentPage,
        });
        this.rankTypes = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createRankType() {
      this.rankTypeCreateModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("rank-type-create-modal");
      });
    },
    editRankType(rankType) {
      this.rankType = rankType;
      this.rankTypeEditModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("rank-type-edit-modal");
      });
    },
    async removeRankType(rankType) {
      this.rankType = rankType;
      try {
        const res = await this.deleteRankType({
          pk: this.rankType.id,
        });
        if (res.status === 204) {
          this.$swal({
            title: "Rank deleted successfully",
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

    async addRanksFromUserAPI() {
      this.show = true;
      try {
        const res = await this.getRankFromUserAPI();
        if (res.status === 200) {
          this.$swal({
            title: "Rank Added From User API successfully",
            icon: "success",
          });
          this.show = false;
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
        this.show = false;
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
      return this.rankTypes.length;
    },
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>

<style></style>

