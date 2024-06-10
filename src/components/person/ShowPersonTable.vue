<template>
  <div>
    <b-table :sticky-header="true" :fields="fields" :items="members">
      <template #cell(manage)="">
        <b-button
          variant="success"
          pill
          class="mr-50"
          size="sm"
          :disabled="mode === modes.VIEW"
          v-if="allowEdit"
          @click="changePresident(context === 'president' ? 1 : 2)"
        >
          Edit
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import util from "@/util.js";
export default {
  components: {},
  props: {
    members: Array,
    context: String,
    allowEdit: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: Number,
      default: 0,
    },
  },
  mixins: [util],
  data() {
    return {
      items: [],
      showMemberModalCount: 0,
      type: null,
      fields: [
        { key: "name", label: "Name" },
        { key: "svc_number", label: "Service Number" },
        { key: "rank_name", label: "Rank" },
        { key: "appointment_name", label: "Appointment" },
        // { key: "role_data.name", label: "Role" },
        // { key: "organization_data.name", label: "Organization" },
        { key: "manage", label: "Manage" },
      ],
    };
  },
  mounted() {
    if (this.members) {
      this.items = this.members;
    }
    if (!this.allowEdit) {
      this.fields = this.fields.slice(0, 4);
    }
  },
  methods: {
    ...mapActions({
      getRankTypes: "appData/getRankTypes",
      getPrefixes: "appData/getPrefixes",
      getPetitionDetailTypes: "appData/getPetitionDetailTypes",
      getPetitionDetailStatuses: "appData/getPetitionDetailStatuses",
      getOrganizations: "appData/getOrganizations",
      getOrganization: "appData/getOrganization",
      getUser: "appData/getUser",
      getUsersUnPaginated: "appData/getUsersUnPaginated",
      getNocs: "appData/getNocs",
      getNoc: "appData/getNoc",
      getAwards: "appData/getAwards",
      getAward: "appData/getAward",
    }),
    initizlizeMethod() {
      if (this.item) {
        this.caseObject = this.item;
        this.brief = this.caseObject.brief ? this.caseObject.brief : "";
        this.remarks = this.caseObject.remarks;
        this.recom = this.caseObject.recom;
        this.members = this.caseObject.members;
        this.individual_involved = this.caseObject.individual_involved;
        this.start_date = this.caseObject.start_date;
        this.completion_date = this.caseObject.completion_date;
        this.status = this.caseObject.status
          ? this.statusName[this.caseObject.status]
          : "";
        this.ordered_by = this.caseObject.ordered_by;
        this.president = this.caseObject.president;
        this.noc = this.caseObject.noc ? this.caseObject.noc_data : null;
        this.award = this.caseObject.award;
        this.civilians = this.caseObject.civilian_involved;
        this.unit = this.caseObject.unit ? this.caseObject.unit_data : "";
        this.formation = this.caseObject.formation_data
          ? this.caseObject.formation_data
          : "";
      }
    },
    print(obj) {
      console.log(obj);
    },
    refreshDataWithAward() {
      this.$emit("refreshDataWithAward");
    },
    changePresident(type) {
      this.type = type;
      this.$emit("changePresident", type);
    },

    addPresident(person) {
      this.president = person;
    },
    addOrderedBy(person) {
      this.ordered_by = person;
    },
    addMember(member) {
      this.members.push(member);
    },
    addOfficerInvolved(officer) {
      this.individual_involved.push(officer);
    },
    addCivilians(civ) {
      this.civilians.push(civ);
    },
  },
};
</script>

<style></style>