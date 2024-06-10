<template>
  <b-card no-body class="h-100 m-0">
    <p class="font-weight-bolder m-0 text-center w-100 mt-50">
      Overall Cases By Nature Of Case
    </p>
    <b-card-body class="h-100 p-50">
      <b-table-simple
        hover
        bordered
        small
        caption-top
        sticky-header
        class="h-100"
      >
        <thead>
          <tr style="width: 100vh">
            <th style="width: 20%" class="text-center my-font-size p-25">
              Nature of Case
            </th>
            <th style="width: 20%" class="text-center my-font-size p-25">
              Completed
            </th>
            <th style="width: 20%" class="text-center my-font-size p-25">
              In Process
            </th>
            <th style="width: 20%" class="text-center my-font-size p-25">
              Over Due
            </th>
            <th style="width: 20%" class="text-center my-font-size p-25">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in tableData"
            :key="index"
            style="width: 100vh"
          >
            <td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              :class="{
                'light-variant-danger':
                  item.noc_name === 'Fin Emb/Misappropriation' ||
                  item.noc_name === 'Cyber Violations' ||
                  item.noc_name === 'Murder',
              }"
            >
              {{ item.noc_name }}
            </td>
            <td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              @click="
                showCase({
                  closed_cases: true,
                  organization: item.org_id,
                  noc_name: item.noc_name,
                })
              "
            >
              {{ item.closed_cases }}
            </td>
            <td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              @click="
                showCase({
                  in_process_cases: true,
                  organization: item.org_id,
                  noc_name: item.noc_name,
                })
              "
            >
              {{ item.in_process_cases }}
            </td>
            <td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              @click="
                showCase({
                  overdue_cases: true,
                  organization: item.org_id,
                  noc_name: item.noc_name,
                })
              "
            >
              {{ item.overdue_cases }}
            </td>
            <td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              @click="
                showCase({
                  total_cases: true,
                  organization: item.org_id,
                  noc_name: item.noc_name,
                })
              "
            >
              {{ item.total_cases }}
            </td>
          </tr>
        </tbody>
      </b-table-simple>
    </b-card-body>
  </b-card>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import util from "@/util.js";
export default {
  mixins: [util],
  props: {
    organization: Object,
    ps: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tableData: [],
      title: "",
      selectedOrganization: null,
      fields: [
        { key: "noc_name", label: "Nature of Case" },
        { key: "closed_cases", label: "Completed" },
        { key: "in_process_cases", label: "In Process" },
        { key: "overdue_cases", label: "Over Due" },
        { key: "total_cases", label: "Total" },
      ],
    };
  },
  async created() {
    this.org_id = this.organization.org_id;
    this.populateTable();
  },

  methods: {
    ...mapActions({
      nocStatisticsData: "appData/nocStatisticsData",
    }),

    selectOrganization(organization) {
      this.selectedOrganization = organization;
      // this.title = organization;
      this.$emit("changeOrganization", organization); // Emit the event
      // this.$nextTick(() => {
      //   this.$bvModal.show("corps-table-modal");
      // });
    },
    async populateTable() {
      try {
        const res = await this.nocStatisticsData({
          organization_id: this.org_id,
          ps: this.ps,
        });
        this.tableData = res.data.formation_nocs;
      } catch (error) {
        this.displayError(error);
      }
    },
    showCase({
      closed_cases,
      overdue_cases,
      in_process_cases,
      total_cases,
      organization,
      noc_name,
    }) {
      this.filter = {};
      if (this.ps === 1) {
        this.filter.ps_1a = true;
      } else if (this.ps === 2) {
        this.filter.ps_1b = true;
      } else if (this.ps === 3) {
        this.filter.ps_1c = true;
      }
      if (this.org_id) {
        this.filter.status = [];
        this.filter.is_verified = true;
        this.filter.noc_formation = organization;
        this.filter.noc_name = noc_name;

        if (total_cases) {
          this.filter.status = null;
        }
        if (overdue_cases) {
          // this.filter.status = this.caseStatus.PROCESSING;
          this.filter.overdue = true;
        }
        if (closed_cases) {
          this.filter.status = this.caseStatus.CLOSED;
        }
        if (in_process_cases) {
          this.filter.in_process_status = [
            this.caseStatus.PENDING,
            this.caseStatus.PROCESSING,
            this.caseStatus.FINALIZED,
          ];
        }
        this.filter.draft = false;
        this.$emit("caseShowModal", this.filter, this.showModalPlace.NOC_TABLE);
      } else {
        this.filter.empty_filter = true;
        this.$emit("caseShowModal", this.filter, this.showModalPlace.NOC_TABLE);
      }
    },
    isSpecialNoc(nocName) {
      return [
        "Cyber Violations",
        "Fin Emb/Misappropriation",
        "Cyber Violations",
      ].includes(nocName);
    },
  },
};
</script>

<style scoped>
.my-font-size-lg {
  font-size: 1.5rem;
}
.my-font-size-sm {
  font-size: 1.5rem;
}
</style>
