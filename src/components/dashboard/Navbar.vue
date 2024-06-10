<template>
  <div style="height: 5%">
    <div 
      class="d-flex justify-content-center align-items-center h-100 bg-primary"
    >
      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center"
        :to="{ name: 'Case' }"
        v-if="hasPermission('show_case')"
      >
        <feather-icon icon="HomeIcon" size="16" class="mr-50 text-white" />
        <span>Home</span>
      </b-link>
      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2"
        :to="{ name: 'Case' }"
        v-if="hasPermission('show_case')"
      >
        <feather-icon icon="FileIcon" size="16" class="mr-50 text-white" />
        <span>Case</span>
      </b-link>
      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2"
        :to="{ name: 'MarkedCases' }"
        v-if="hasPermission('show_marked_cases')"
      >
        <feather-icon icon="FileIcon" size="16" class="mr-50 text-white" />
        <span>MARKED</span>
      </b-link>
      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2"
        :to="{ name: 'AllCases' }"
        v-if="hasPermission('show_all_cases')"
      >
        <feather-icon icon="FileIcon" size="16" class="mr-50 text-white" />
        <span>ALL Case</span>
      </b-link>
      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2"
        :to="{ name: 'PS-1A' }"
        v-if="hasPermission('show_ps_1a')"
      >
        <feather-icon icon="FileIcon" size="16" class="mr-50 text-white" />
        <span>PS-1A Cases</span>
      </b-link>
      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2"
        :to="{ name: 'PS-1B' }"
        v-if="hasPermission('show_ps_1b')"
      >
        <feather-icon icon="FileIcon" size="16" class="mr-50 text-white" />
        <span>PS-1B Cases</span>
      </b-link>
      <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2"
        :to="{ name: 'PS-1C' }"
        v-if="hasPermission('show_ps_1c')"
      >
        <feather-icon icon="FileIcon" size="16" class="mr-50 text-white" />
        <span>PS-1C Cases</span>
      </b-link>
      <!-- <a
        v-if="selectedOrganization"
        href="javascript:void(0)"
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2"
        @click="reloadPage"
      >
        <feather-icon icon="HomeIcon" size="16" class="mr-50 text-white" />
        <span>Back to Main Dashboard</span>
      </a> -->

      <!-- <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2"
        :to="{ name: 'ApprovePetition' }"
      >
        <feather-icon icon="FileIcon" size="16" class="mr-50 text-white" />
        <span>Outstanding Petition</span>
      </b-link> -->

      <!-- <b-link
        class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2"
        :to="{ name: 'ApprovedPetition' }"
      >
        <feather-icon icon="FileIcon" size="16" class="mr-50 text-white" />
        <span>Approved</span>
      </b-link> -->

      <!-- <b-link class="text-white my-nav-item my-nav-link d-flex align-items-center ml-2" :to="{ name: 'SearchPetition' }"
        v-if="hasPermission('petition_can_search')">
        <feather-icon icon="FileIcon" size="16" class="mr-50 text-white" />
        <span>Search</span>
      </b-link>

      <b-dropdown text="Reports" class="m-0 p-0 ml-2" variant="primary" size="sm" v-if="
        hasPermission('daily_report_show') ||
        hasPermission('overall_report_show')
      ">
        <template #button-content>
          <feather-icon icon="FileIcon" size="15" class="mr-50 text-white" />
          Reports
        </template>
        <b-dropdown-item v-if="hasPermission('daily_report_show')" :to="{ name: 'Daily' }">Daily</b-dropdown-item>
        <b-dropdown-item v-if="hasPermission('overall_report_show')" :to="{ name: 'Overall' }">Overall</b-dropdown-item>
      </b-dropdown> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  // props: {
  //   selectedOrganization: String,
  // },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
  methods: {
    reloadPage() {
      window.location.reload();
    },
  },
  // created() {
  //   if (this.selectedOrganization === "Army Data") {
  //     // Set it to null when 'army' is the initial value
  //     this.selectedOrganization = null;
  //   }
  // },
};
</script>

<style></style>
