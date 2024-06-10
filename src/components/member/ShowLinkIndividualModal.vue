<template>
  <div>
    <b-modal
      id="show_officer-create-modal"
      title="Prefix Create Modal"
      centered
      hide-footer
      size="lg"
      :no-close-on-esc="true"
      :no-close-on-backdrop="true"
    >
      <template #modal-title>
        <h2 class="m-0">Individual Involved</h2>
      </template>
      <b-card>
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
          <template #cell(doc_name)="row">
            <span>
              <!-- <a :href="row.item.doc_path"></a> -->
              <a
                :href="row.item.doc_path"
                target="_blank"
                rel="noopener noreferrer"
                >{{ row.item.doc_name }}</a
              >
            </span>
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
              variant="success"
              pill
              class="mr-50"
              size="sm"
              v-if="(isOldInquiry)||!(mode === modes.CREATE) && !(mode === modes.VIEW)"
              @click="createDocument(row.item)"
              v-b-tooltip.hover="'add award and document'"
            >
              Edit
            </b-button>
            <b-button
              variant="success"
              pill
              class="mr-50"
              size="sm"
              v-if="!(mode === modes.VIEW)"
              @click="removeIndividualInvolved(row.item)"
            >
              Remove
            </b-button>
          </template>
        </b-table>
      </b-card>
    </b-modal>
    <DocumentAwardCreateModal
      @refreshDataWithAward="refreshDataWithAward"
      @uploadDocAndAward="uploadDocAndAward"
      @setIndividual="setIndividual"
      :pk="pk"
      :addItem="addItem"
      :case_no="case_no"
      :key="`create-award-document-${createdocsAwardModalCount}`"
    />
  </div>
</template>
    
    <script>
import { mapActions, mapGetters } from "vuex";
import DocumentAwardCreateModal from "@/components/document/DocumentAwardCreateModal.vue";
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    DocumentAwardCreateModal,
  },
  props: {
    items: [],
    case_id: Number,
    mode: {
      type: Number,
      default: 0,
    },
    isOldInquiry: Boolean,
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
      course: "",
      members: [],
      totalItems: 0,
      createdocsAwardModalCount: 0,
      pk: null,
      item: null,
      addItem: false,
      case_no: null,

      fields: [
        { key: "name", label: "Name" },
        { key: "rank_name", label: "Rank" },
        { key: "svc_number", label: "Service No" },
        { key: "appointment_name", label: "Appointment" },
        { key: "award_name", label: "Award" },
        { key: "doc_name", label: "PDF" },
        { key: "manage", label: "Manage" },
      ],
    };
  },
  mounted() {
    this.initizlizeMethod();
    if (this.mode == this.modes.CREATE && !this.isOldInquiry) {
      let individualShowFields = this.fields.slice(0, 4);
      individualShowFields.push(this.fields[6]);
      this.fields = individualShowFields;
    }
    if (this.mode == this.modes.CREATE && this.isOldInquiry) {
      this.fields = this.fields
    }
    this.totalItems = this.items.length;
  },
  methods: {
    ...mapActions({
      createMember: "appData/createMember",
      getPrefixes: "appData/getPrefixes",
      getRankTypes: "appData/getRankTypes",
      getMembers: "appData/getMembers",
      getUsers: "appData/getUsers",
      getOrganizations: "appData/getOrganizations",
      deleteIndividual: "appData/deleteIndividual",
    }),
    refreshDataWithAward() {
      this.$emit("refreshDataWithAward");
    },
    initizlizeMethod() {
      // this.totalItems = temp.length;
      this.members = [];
      this.items.forEach((ind) => {
        let temp = ind;
        if (temp.case) {
          temp.individual_data.pk = ind.id;
          if (temp.award) {
            temp.individual_data.award_name = temp.award_data.name;
          } else {
            temp.individual_data.award_name = temp.award_name
              ? temp.award_name
              : "";
          }
          if (temp.document) {
            temp.individual_data.doc_name = temp.document_data.name;
            temp.individual_data.doc_path = temp.document_data.path;
          } else {
            temp.individual_data.doc_name = temp.doc_name ? temp.doc_name : "";
          }
          this.members.push(temp.individual_data);
        } else {
          this.members.push(ind);
        }
      });
    },
    setIndividual(item) {
      this.$emit("setIndividual", item);
    },
    addAward() {
      this.createAwardModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-award-modal");
      });
    },

    createDocument(item) {
      if (!item.pk) {
        this.addItem = true;
        this.pk = item.id;
        this.case_no = this.case_id;
      } else {
        this.pk = item.pk;
      }

      this.createdocsAwardModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("document-award-create-modal");
      });
    },

    async removeIndividualInvolved(item) {
      const itemInRelation = this.items.filter(
        (i) => (i.individual ? i.individual : i.id) === item.id
      )[0];
      if (this.mode === this.modes.CREATE) {
        this.$emit("removeIndividual", itemInRelation);
        this.$nextTick(() => {
          this.$bvModal.hide("show_officer-create-modal");
        });
        this.refreshDataWithAward();
        this.$emit("modalClosed");
      } else if (this.mode === this.modes.EDIT) {
        this.$emit("removeIndividual", itemInRelation);
        this.$nextTick(() => {
          this.$bvModal.hide("show_officer-create-modal");
        });
        this.refreshDataWithAward();
        this.$emit("modalClosed");
      } else {
        try {
          const res = await this.deleteIndividual({
            pk: this.item[0].id,
          });
          if (res.status === 204) {
            this.$swal({
              title: "Individual Involved deleted successfully",
              icon: "success",
            });
            this.$nextTick(() => {
              this.$bvModal.hide("show_officer-create-modal");
            });
            this.refreshDataWithAward();
            this.$emit("modalClosed");

            // if (
            //   (this.totalItems - 1) % this.perPage === 0 &&
            //   this.currentPage !== 1
            // ) {
            //   this.currentPage -= 1;
            // } else {
            //   await this.fetchPaginatedData();
            // }
          }
        } catch (error) {
          this.displayError(error);
        }
      }
    },

    uploadDocAndAward(formData) {
      this.refreshDataWithAward();
      this.$nextTick(() => {
        this.$bvModal.hide("show_officer-create-modal");
      });
      this.$emit("uploadDocAndAward", formData);
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
    items() {
      this.initizlizeMethod();
    },
  },
};
</script>
    
    <style></style>
    