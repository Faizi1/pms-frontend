<template>
  <div>
    <div class="text-right mb-1">
      <!-- <b-button
        variant="primary"
        pill
        @click="createOldInquiry"
        v-if="hasPermission('create_case')"
        class="mr-1"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create Old Inquiry</span>
      </b-button>  -->
      <b-button
        variant="primary"
        pill
        @click="createPetition"
        v-if="hasPermission('create_case')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col cols="5">
          <b-form-group label="Army No" label-for="armyNo">
            <b-form-input id="armyNo" v-model="armyNo" placeholder="Army No" />
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-button variant="primary" pill @click="search">
            <feather-icon icon="SearchIcon" class="mr-50" />
            <span class="align-middle">Search</span>
          </b-button>
        </b-col>
      </b-row>
      <b-table
        :fields="fields"
        :items="cases"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_case')"
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
        <template #cell(start_date)="row">
          {{ getDateString(row.item.start_date) }}
        </template>
        <template #cell(brief)="row">
          <div :title="row.item.brief">
            {{ truncateText(row.item.brief, 30) }}
          </div>
        </template>
        <template #cell(status)="row">
          {{ statusNames(row.item.status) }}
        </template>
        <template #cell(completion_date)="row">
          {{ getDateString(row.item.completion_date) }}
        </template>
        <template #cell(ordered_by)="row">
          {{ getMembersData(row.item.ordered_by_data) }} - {{ getMember(row.item.ordered_by_data) }}
        </template>
        <template #cell(president)="row">
          {{ getMembersData(row.item.president_data) }} - {{ getMember(row.item.president_data) }}
        </template>
        <template #cell(noc_data)="row">
          {{ row.item.noc_data ? row.item.noc_data.name : "" }}
        </template>

        <template #cell(manage)="row">
          <!-- <b-button
            variant="success"
            pill
            class="mr-50"
            size="sm"
            @click="detailCase(row.item)"
            v-if="hasPermission('read_case')"
          >
            Detail
          </b-button> -->
          <b-button
            variant="success"
            pill
            class="mr-50"
            size="sm"
            @click="editPetition(row.item)"
            v-if="hasPermission('update_case') && row.item.draft"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removePetition(row.item)"
            v-if="hasPermission('delete_case')"
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
        class="d-flex justify-content-center"
      ></b-pagination>
    </b-card>
    <case-create-modal
      @modalClosed="onModalClosed"
      :key="`create-${caseCreateModalCount}`"
      :isOldInquiry="isOldInquiry" 
    />
    <case-edit-modal
      :item="item"
      @modalClosed="onModalClosed"
      :key="`edit-${caseEditModalCount}`"
    />
    <case-draft-modal
      :item="item"
      @modalClosed="onModalClosed"
      :key="`draft-${caseDraftModalCount}`"
    />
    <case-detail-modal
      id="case-detail-show-modal"
      :item="item"
      @modalClosed="onModalClosed"
      :mode="1"
      :key="`detail-${caseDetailModalCount}`"
    />
  </div>
</template>
  
<script>
import { mapActions, mapGetters } from "vuex";
import CaseCreateModal from "@/components/case/CaseCreateModal.vue";
import CaseEditModal from "@/components/case/CaseEditModal.vue";
import CaseDetailModal from "@/components/case/CaseDetailModal.vue";
import CaseDraftModal from "@/components/case/CaseDraftModal.vue";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import util from "@/util.js";

export default {
  components: {
    CaseCreateModal,
    CaseEditModal,
    CaseDetailModal,
    VueSelectPaginated,
    CaseDraftModal,
  },
  mixins: [util],
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "token_no", label: "Token No" },
        { key: "brief", label: "brief" },
        { key: "no_of_officer", label: "no of indl" },
        { key: "start_date", label: "start date" },
        { key: "completion_date", label: "completion date" },
        { key: "status", label: "status" },
        { key: "ordered_by", label: "ordered by" },
        { key: "president", label: "President" },
        { key: "noc_data", label: "Nature of Case" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      cases: [],
      item: null,
      caseCreateModalCount: 0,
      caseEditModalCount: 0,
      caseDetailModalCount: 0,
      caseDraftModalCount: 0,
      prefix: null,
      armyNo: "",
      isOldInquiry: false,
    };
  },
  async mounted() {
    try {
      await this.fetchPaginatedData();
    } catch (error) {
      this.displayError(error);
    }
  },
  methods: {
    ...mapActions({
      getCases: "appData/getCases",
      getPrefixes: "appData/getPrefixes",
      deleteCase: "appData/deleteCase",
    }),
    async search() {
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getCases({
          pageNumber: this.currentPage,
          created_by: this.getLoggedInUser.id,
          draft: true,
          ServiceNum: this.armyNo,
        });
        this.cases = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createPetition() {
      this.caseCreateModalCount += 1;
      this.isOldInquiry = false;
      this.$nextTick(() => {
        this.$bvModal.show("case-create-modal");
      });
    },
    createOldInquiry() {
      this.caseCreateModalCount += 1;
      this.isOldInquiry = true;
      this.$nextTick(() => {
        this.$bvModal.show("case-create-modal");
      });
    },
    editPetition(item) {
      this.item = item;
      if (this.item.draft) {
        this.petitionDraftModalCount += 1;
        this.$nextTick(() => {
          this.$bvModal.show("case-draft-modal");
        });
      } else {
        this.caseEditModalCount += 1;
        this.$nextTick(() => {
          this.$bvModal.show("case-edit-modal");
        });
      }
    },
    detailCase(item) {
      this.item = item;
      this.caseDetailModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("case-detail-show-modal");
      });
    },
    // closePetition(petition) {
    //     this.petition = petition;
    //     this.petitionCloseModalCount += 1;
    //     this.$nextTick(() => {
    //         this.$bvModal.show("petition-close-modal");
    //     });
    // },
    async onModalClosed() {
      await this.fetchPaginatedData();
    },
    // async openLinked(id) {
    //     try {
    //         this.$nextTick(() => {
    //             this.$bvModal.hide("petition-detail-modal");
    //         });
    //         const res = await this.getPetition({ pk: id });
    //         this.petition = res.data;
    //         this.PetitionDetailModalCount += 1;
    //         this.$nextTick(() => {
    //             this.$bvModal.show("petition-detail-modal");
    //         });
    //     } catch (error) {
    //         this.displayError(error);
    //     }
    // },
    // this.$swal({
    //     title: 'Are you sure?',
    //     text: "You won't be able to revert this!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, delete it!',
    //     customClass: {
    //       confirmButton: 'btn btn-primary',
    //       cancelButton: 'btn btn-outline-danger ml-1',
    //     },
    //     buttonsStyling: false,
    //   }).then(result => {
    //     if (result.value) {
    //       this.$swal({
    //         icon: 'success',
    //         title: 'Deleted!',
    //         text: 'Your file has been deleted.',
    //         customClass: {
    //           confirmButton: 'btn btn-success',
    //         },
    //       })
    //     }
    //   })
    async removePetition(petition) {
      this.petition = petition;
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
            const res = await this.deleteCase({
              pk: this.petition.id,
            });
            if (res.status === 204) {
              this.$swal({
                icon: "success",
                title: "Deleted!",
                text: "Draft Case has been deleted.",
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
  },
  // nextPetition() {
  //     let petitionIndex = 0;
  //     for (let i = 0; i < this.petitions.length; i++) {
  //         const element = this.petitions[i];
  //         if (element.id == this.petition.id) {
  //             petitionIndex = i;
  //             break;
  //         }
  //     }
  //     petitionIndex += 1;
  //     if (petitionIndex > this.petitions.length - 1) {
  //         this.displayError("No More Petitions");
  //         return;
  //     }
  //     this.$nextTick(() => {
  //         this.$bvModal.hide("petition-detail-modal");
  //     });
  //     this.petition = this.petitions[petitionIndex];
  //     this.petitionDetailModalCount += 1;
  //     this.$nextTick(() => {
  //         this.$bvModal.show("petition-detail-modal");
  //     });
  // },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
    rows() {
      return this.petitions.length;
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
  
  