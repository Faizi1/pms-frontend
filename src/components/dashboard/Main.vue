<template>
  <div style="height: 82%" class="py-50 px-50">
    <div style="height: 10%" class="mb-50">
      <SelectedOrganizationLabel
        :organization="organization"
        @changeRootOrganization="changeRootOrganization"
        :key="SelectedOrganizationLabelCount"
      />
    </div>
    <div style="height: 90%">
      <b-row class="h-100" no-gutters>
        <b-col md="3" class="h-100 px-50">
          <div style="height: 50%">
            <Received
              @caseShowModal="caseShowModal"
              :key="receivedCount"
              :organization="organization"
              :ps="ps"
            />
          </div>
          <div style="height: 50%" class="pt-50">
            <CatWise
              @caseShowModal="caseShowModal"
              :key="catWiseCount"
              :organization="organization"
              :ps="ps"
            />
          </div>
        </b-col>
        <b-col md="6" class="h-100 px-50">
          <div style="height: 50%">
            <Table
              :key="tableCount"
              :organization="organization"
              @changeOrganization="changeOrganization"
              @caseShowModal="caseShowModal"
              :ps="ps"
            />
          </div>
          <div style="height: 50%" class="pt-50">
            <NocTable
              :key="nocTableCount"
              :organization="organization"
              @caseShowModal="caseShowModal"
              :ps="ps"
            />
          </div>
        </b-col>
        <b-col md="3" class="h-100 px-50">
          <div style="height: 50%">
            <ReceivedGraph
              @caseShowModal="caseShowModal"
              :key="receivedGraphCount"
              :organization="organization"
              :ps="ps"
            />
          </div>
          <div style="height: 50%" class="pt-50">
            <CatWiseGraph
              :key="catWaiseGraphCount"
              :organization="organization"
              @caseShowModal="caseShowModal"
              :ps="ps"
            />
          </div>
        </b-col>
      </b-row>
    </div>
    <case-show-modal
      id="case-show-modal"
      :filter="filter"
      :key="`detail-main-${caseShowModalCount}`"
      @onModalClosed="onModalClosed"
    />
  </div>
</template>

<script>
import store from "@/store";
import { mapActions, mapGetters } from "vuex";
import Received from "@/components/dashboard/Received.vue";
import CatWise from "@/components/dashboard/CatWise.vue";
import Table from "@/components/dashboard/Table.vue";
import NocTable from "@/components/dashboard/NocTable.vue";
import CaseShowModal from "@/components/case/CaseShowModal.vue";
import ReceivedGraph from "@/components/dashboard/ReceviedGraph.vue";
import CatWiseGraph from "@/components/dashboard/CatWiseGraph.vue";
import SelectedOrganizationLabel from "./SelectedOrganizationLabel.vue";
import util from "@/util.js";

export default {
  components: {
    Received,
    CatWise,
    Table,
    NocTable,
    CaseShowModal,
    ReceivedGraph,
    CatWiseGraph,
    SelectedOrganizationLabel,
  },
  mixins: [util],
  data() {
    return {
      receivedCount: 0,
      catWiseCount: 0,
      tableCount: 0,
      nocTableCount: 0,
      SelectedOrganizationLabelCount: 0,
      receivedGraphCount: 0,
      catWaiseGraphCount: 0,
      caseShowModalCount: 0,
      showClose: false,
      filter: {},
      place: 0,
      organization: null,
      parent_organization: {},
      ps: 0,
    };
  },
  created() {
    if (store.getters["appData/hasRole"]("ps-1a")) {
      this.ps = this.PS.ps_a;
    } else if (store.getters["appData/hasRole"]("ps-1b")) {
      this.ps = this.PS.ps_b;
    } else if (store.getters["appData/hasRole"]("ps-1c")) {
      this.ps = this.PS.ps_c;
    }
    if (this.getLoggedInUser.parent_organization_data) {
      this.parent_organization.org_id =
        this.getLoggedInUser.parent_organization_data.id;
      this.parent_organization.org_name =
        this.getLoggedInUser.parent_organization_data.name;
    } else {
      this.parent_organization.org_id = null;
      this.parent_organization.org_name = null;
      this.$swal({
        title: "Login User Does Not have Parent Organization",
        icon: "info",
      });
    }

    this.organization = this.parent_organization;
  },
  methods: {
    caseShowModal(filter, place) {
      this.place = place;
      this.filter = filter;
      this.caseShowModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("case-show-modal");
      });
    },

    onModalClosed() {
      if (this.place === this.showModalPlace.STATISTICS) {
        this.statisticsCount += 1;
      } else if (this.place === this.showModalPlace.RECEIVED) {
        this.receivedCount += 1;
      } else if (this.place === this.showModalPlace.CAT_TABLE) {
        this.catWiseCount += 1;
      } else if (this.place === this.showModalPlace.NOC_TABLE) {
        this.nocTableCount += 1;
      }
    },
    changeOrganization(org) {
      this.organization = org;
      this.statisticsCount += 1;
      this.receivedCount += 1;
      this.catWiseCount += 1;
      this.tableCount += 1;
      this.nocTableCount += 1;
      this.receivedGraphCount += 1;
      this.catWaiseGraphCount += 1;
      this.SelectedOrganizationLabelCount += 1;
    },
    changeRootOrganization() {
      this.organization = this.parent_organization;
      this.statisticsCount += 1;
      this.receivedCount += 1;
      this.catWiseCount += 1;
      this.tableCount += 1;
      this.nocTableCount += 1;
      this.receivedGraphCount += 1;
      this.catWaiseGraphCount += 1;
      this.SelectedOrganizationLabelCount += 1;
    },
  },
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
  },
};
</script>
