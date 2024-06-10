<template>
  <div style="height: 100%">
    <b-row align-v="center">
      <b-col md="2">
        <b-form-group label-for="token_no">
          <template #label>
            Token No <span class="text-danger"> *</span>
          </template>

          <b-form-input
            id="token_no"
            v-model="token_no"
            placeholder="Token No"
          />
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-form-group label-for="army_no">
          <template #label>
            Army no <span class="text-danger"> *</span>
          </template>

          <b-form-input id="army_no" v-model="army_no" placeholder="Army No" />
        </b-form-group>
      </b-col>
      <b-col md="3" class="d-flex">
        <b-button variant="primary" pill @click="search" class="mr-2" size="sm">
          <feather-icon icon="SearchIcon" class="mr-50" />
          <span class="align-middle">Search</span>
        </b-button>

        <b-button
          variant="primary"
          pill
          @click="AdvanceSearch"
          size="sm"
          style="border: 1px solid black"
        >
          <feather-icon icon="SearchIcon" class="mr-50" />
          <span class="align-middle">Advance Search</span>
        </b-button>
      </b-col>
      <b-col md="3">
        <span
          style="
            font-size: 2rem;
            color: rgb(177, 28, 9);
            font-weight: bold;
            text-wrap: nowrap;
          "
          class="align-middle ml-2"
          >{{ organization_name }}</span
        >
      </b-col>
      <b-col md="2" v-if="organization_id != RootOrg.org_id">
        <div style="margin-inline: auto; width: max-content">
          <b-button
            variant="primary"
            pill
            @click="changeOrganization"
            size="sm"
          >
            <span class="align-middle">Main Dashboard</span>
          </b-button>
        </div>
      </b-col>
    </b-row>
    <dashboard-case-modal
      :filter="item"
      @modalClosed="onModalClosed"
      :key="`caseShowdetail-${showCaseModalCount}`"
    />
    <case-show-modal
      :key="`detail-${AdvanceCaseModalCount}`"
      @onModalClosed="onModalClosed"
    />
  </div>
</template>

<script>
import util from "@/util.js";
import DashboardCaseModal from "@/components/case/DashBoardCaseModal.vue";
import AdvanceCaseShowModal from "@/components/case/CaseShowModal.vue";
export default {
  components: {
    DashboardCaseModal,
    AdvanceCaseShowModal,
  },
  mixins: [util],
  props: {
    organization: Object,
  },
  data() {
    return {
      organization_name: "",
      organization_id: "",
      token_no: "",
      army_no: "",
      item: {},
      showCaseModalCount: 0,
      AdvanceCaseModalCount: 0,
    };
  },
  created() {
    this.organization_name = this.organization.org_name;
    this.organization_id = this.organization.org_id;
  },
  methods: {
    changeOrganization() {
      this.$emit("changeRootOrganization");
    },
    search() {
      // this.item = item;
      this.token_no = this.token_no;
      this.army_no = this.army_no;
      this.item["token_no"] = this.token_no;
      this.item["army_no"] = this.army_no;
      this.showCaseModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("dashboard-case-modal");
      });
    },
    AdvanceSearch() {
      this.AdvanceCaseModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("case-show-modal");
      });
    },

    async onModalClosed() {
      await this.fetchPaginatedData();
    },
  },
};
</script>
