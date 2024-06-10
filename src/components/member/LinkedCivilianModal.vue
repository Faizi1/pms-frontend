<template>
  <b-modal
    id="linked-civilan-modal"
    centered
    hide-footer
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Add Civilian</h2>
    </template>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="5">
          <div v-if="searchType">
            <b-row v-if="searchType.value === 1">
              <b-col>
                <b-form-group label="CNIC" label-for="cnic">
                  <b-form-input id="cnic" v-model="cnic" placeholder="cnic" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="searchType.value === 2">
              <b-col>
                <b-form-group label="Name" label-for="name">
                  <b-form-input id="name" v-model="name" placeholder="name" />
                </b-form-group>
              </b-col>
            </b-row>
          </div>
        </b-col>
        <b-col md="4">
          <b-form-group label="Search Type" label-for="searchType">
            <v-select
              id="searchType"
              v-model="searchType"
              :options="memberTypes"
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
            @click="addCivilianPerson(row.item)"
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
        <b-button variant="primary" pill class="mr-1" @click="createCivilian">
          ADD
        </b-button>
      </b-form-group>
    </b-form>
    <create-civilian-modal
      @modalClosed="onModalClosed"
      :key="`create${createCivilianModalCount}`"
    />
    <edit-civilian-modal
      :civ="civ"
      @modalClosed="onModalClosed"
      :key="`edit-${civilianEditModalCount}`"
    />
  </b-modal>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import CreateCivilianModal from "@/components/civilians/CreateCivilianModal.vue";
import EditCivilianModal from "@/components/civilians/EditCivilianModal.vue";
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
    CreateCivilianModal,
    EditCivilianModal,
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
      cnic: "",
      search_prefix: null,
      search_army_no: "",
      members: [],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      member_type: "",
      createCivilianModalCount: 0,
      civilianEditModalCount: 0,
      civ: "",
      searchType: { value: 1, name: "CNIC" },
      fields: [
        { key: "name", label: "name" },
        { key: "cnic", label: "cnic" },
        { key: "manage", label: "Manage" },
      ],
    };
  },
  methods: {
    ...mapActions({
      createMember: "appData/createMember",
      getRankTypes: "appData/getRankTypes",
      getMembers: "appData/getMembers",
      getCivilian: "appData/getCivilians",
    }),
    createCivilian() {
      // this.createCivilianModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-civilian-modal");
      });
    },
    editCivilian(civ) {
      this.civ = civ;
      this.civilianEditModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-civilian-modal");
      });
    },
    async onModalClosed() {
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getCivilian({
          pageNumber: this.currentPage,
          name: this.name,
          cnic: this.cnic,
        });
        this.members = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.name = "";
            break;
          case 2:
            this.cnic = "";
            break;
        }
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    addCivilianPerson(item) {
      this.$emit("addCivilians", item);
      this.$nextTick(() => {
        this.$bvModal.hide("linked-civilan-modal");
      });
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
};
</script>
  
  <style></style>
  