<template>
  <div>
    <div>
      <b-row align-h="center" class="mb-1" v-if="caseObject">
        <b-col class="d-flex align-items-center justify-content-between">
          <h3 class="mb-0 text-center w-100">
            <span class="font-weight-bolder">Token No:</span>
            {{ caseObject ? caseObject.token_no : "" }}
          </h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group label-for="brief_id">
            <template #label>
              Brief of Case <span class="text-danger"> *</span>
            </template>
            <validation-provider
              #default="{ errors }"
              name="brief"
              :rules="{
                required,
                regex: regexPattern,
                max: 2000,
              }"
              :disabled="mode === modes.VIEW"
            >
            <b-form-textarea
                  id="brief_id"
                  v-model="brief"
                  maxlength="2001"
                  :state="errors.length > 0 ? false : null"
                  :disabled="mode === modes.VIEW"
                  placeholder="Brief of Case"
                  rows="2"
                  class="char-textarea"
                ></b-form-textarea>
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group
            label="Marking Type"
            label-for="markingType"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-radio-group
              id="markingType"
              v-model="selectedMarkType"
              :aria-describedby="ariaDescribedby"
              @change="onMarkTypeChange"
            >
              <b-form-radio v-model="selectedMarkType" :value="1">
                Internal
              </b-form-radio>
              <b-form-radio v-model="selectedMarkType" :value="2">
                External
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <VueSelectPaginated
            name="Organization"
            label="name"
            :rules="{ required: !draft }"
            :disabled="!(selectedMarkType == 2)"
            :prevSelected="selectedOrganization"
            :getMethod="getOrganization"
            :getListMethod="getOrganizations"
            @setMethod="onOrganizationChange"
            searchBy="name"
            ref="selectedOrganizationRef"
          />
        </b-col>
      </b-row>
      <b-row class="match-height">
        <b-col md="6">
          <b-row>
            <b-col md="6">
              <b-form-group>
                <VueSelectPaginated
                  name="Nature of Case"
                  label="name"
                  :rules="{ required: true }"
                  :prevSelected="noc"
                  :getListMethod="getNocs"
                  :disabled="mode === modes.VIEW"
                  @setMethod="
                    (value) => {
                      noc = value;
                    }
                  "
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label-for="remarks_id">
                <template #label>
                  Remarks <span class="text-danger"></span>
                </template>
                <validation-provider
                  #default="{ errors }"
                  name="remarks"
                  :rules="{ regex: regexPattern, max: 2000 }"
                >
                  <b-form-input
                    id="remarks_id"
                    v-model="remarks"
                    :state="errors.length > 0 ? false : null"
                    maxlength="2001"
                    placeholder="Remarks"
                    :disabled="mode === modes.VIEW"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <VueSelectPaginated
                name="Unit"
                label="name"
                :rules="{ required: true }"
                :prevSelected="unit"
                :getListMethod="getOrganizations"
                :disabled="mode === modes.VIEW"
                @setMethod="
                  (value) => {
                    unit = value;
                  }
                "
                searchBy="name"
              />
            </b-col>

            <b-col md="6">
              <VueSelectPaginated
                name="Formation"
                label="name"
                :rules="{ required: true }"
                :prevSelected="formation"
                :parameters="{
                  organization_relation: true,
                }"
                :getListMethod="getOrganizations"
                :disabled="mode === modes.VIEW"
                @setMethod="
                  (value) => {
                    formation = value;
                  }
                "
                searchBy="name"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group label-for="startdate">
                <template #label>
                  Start Date <span class="text-danger"></span>
                </template>
                <validation-provider name="startdate" :rules="required">
                  <b-form-datepicker
                    id="startdate"
                    v-model="start_date"
                    :disabled="!isOldInquiry"
                  ></b-form-datepicker>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label-for="completedate">
                <template #label>
                  End Date <span class="text-danger"></span>
                </template>
                <validation-provider name="completedate" :rules="required">
                  <b-form-datepicker
                    id="completedate"
                    v-model="completion_date"
                    :disabled="!isOldInquiry"
                  ></b-form-datepicker>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-row>
                <b-col md="6">
                  <b-form-group label-for="no_of_off">
                    <template #label>
                      Individual Involved <span class="text-danger">*</span>
                    </template>
                    <validation-provider
                      #default="{ errors }"
                      name="Individaul Involved"
                      :rules="{ required, regex: /^[0-9]*$/i }"
                    >
                      <b-form-input
                        id="no_of_off"
                        v-model="no_of_officer"
                        disabled
                        :state="errors.length > 0 ? false : null"
                        placeholder="0"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>

                <b-col md="2" class="mt-1">
                  <div style="border-radius: 8px">
                    <b-row>
                      <b-col class="m-50">
                        <b-button
                          variant="primary"
                          size="sm"
                          :disabled="mode === modes.VIEW"
                          @click="createMember(4)"
                        >
                          <feather-icon icon="PlusIcon" class="mr-25 mb-25" />
                          <span>Add</span>
                        </b-button>
                      </b-col>
                    </b-row>
                  </div>
                </b-col>
                <b-col md="2" class="mt-1">
                  <div style="border-radius: 8px">
                    <b-row>
                      <b-col class="m-50">
                        <b-button
                          variant="dark"
                          size="sm"
                          @click="showLinkedIndividual"
                        >
                          <feather-icon icon="UserIcon" class="mr-30 mb-25" />
                          <span>View/Edit</span>
                        </b-button>
                      </b-col>
                    </b-row>
                  </div>
                </b-col>
              </b-row>
            </b-col>
            <b-col md="6">
              <b-row>
                <b-col md="6">
                  <b-form-group label-for="no_of_civ">
                    <template #label>
                      Civilian Involved <span class="text-danger"></span>
                    </template>
                    <validation-provider
                      #default="{ errors }"
                      name="no_of_civ"
                      :rules="{ regex: /^[0-9]*$/i }"
                    >
                      <b-form-input
                        id="no_of_civ"
                        v-model="no_of_civilain"
                        disabled
                        :state="errors.length > 0 ? false : null"
                        placeholder="0"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>

                <b-col md="2" class="mt-1">
                  <div style="border-radius: 8px">
                    <b-row>
                      <b-col class="m-50">
                        <b-button
                          variant="primary"
                          size="sm"
                          @click="openCiviliansModal"
                          :disabled="mode === modes.VIEW"
                        >
                          <feather-icon icon="PlusIcon" class="mr-25 mb-25" />
                          <span>Add</span>
                        </b-button>
                      </b-col>
                    </b-row>
                  </div>
                </b-col>
                <b-col md="2" class="mt-1">
                  <div style="border-radius: 8px">
                    <b-row>
                      <b-col class="m-50">
                        <b-button
                          variant="dark"
                          size="sm"
                          @click="showLinkedCivilian"
                        >
                          <feather-icon icon="UserIcon" class="mr-30 mb-25" />
                          <span>View/Edit</span>
                        </b-button>
                      </b-col>
                    </b-row>
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-col md="13">
            <b-form-group label-for="recom_id">
              <template #label>
                Recommentation <span class="text-danger"></span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="recom"
                :rules="{ regex: regexPattern, max: 2000 }"
              >
                <b-form-textarea
                  id="recom_id"
                  v-model="recom"
                  maxlength="2001"
                  :state="errors.length > 0 ? false : null"
                  :disabled="mode === modes.VIEW"
                  placeholder="Recomentation"
                  rows="2"
                  class="char-textarea"
                ></b-form-textarea>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-col>

        <b-col md="6">
          <b-row class="pl-1">
            <small class="text-dar" style="font-weight: bold; color: #067ae7cb"
              >Drag and drop User to Mark
            </small></b-row
          >
          <b-row>
            <b-col md="5">
              <b-form-group label="Users (From)">
                <vue-perfect-scrollbar
                  :settings="perfectScrollbarSettings"
                  class="scroll-area-size border border-primary"
                >
                  <draggable
                    :list="availableUserList"
                    :move="checkMove"
                    tag="ul"
                    :group="{
                      name: 'users',
                      pull: 'clone',
                      put: true,
                    }"
                    class="list-group list-group-flush cursor-move"
                  >
                    <b-list-group-item
                      v-for="(listItem, index) in availableUserList"
                      :key="index"
                      tag="li"
                    >
                      <div class="d-flex">
                        <div class="ml-25">
                          <b-card-text class="mb-0 font-weight-bold">
                            {{ listItem.appointment_name }}-{{ listItem.name }}
                          </b-card-text>
                        </div>
                      </div>
                    </b-list-group-item>
                  </draggable>
                </vue-perfect-scrollbar>
              </b-form-group>
            </b-col>
            <b-col
              md="1"
              class="d-flex align-items-center justify-content-center"
            >
              <span style="font-size: 24px">⇌</span>
            </b-col>
            <b-col md="5">
              <b-form-group>
                <template #label>
                  Marked (To) <span class="text-danger">*</span>
                </template>
                <vue-perfect-scrollbar
                  :settings="perfectScrollbarSettings"
                  class="scroll-area-size"
                >
                  <draggable
                    :list="markedUserList"
                    @change="onListChange"
                    tag="ul"
                    group="users"
                    :class="`${
                      markedUserList.length === 0 && isSubmtRequested
                        ? 'border border-danger'
                        : 'border border-primary'
                    } list-group list-group-flush cursor-move`"
                  >
                    <b-list-group-item
                      v-for="(listItem, index) in markedUserList"
                      :key="index"
                      tag="li"
                    >
                      <div class="d-flex">
                        <div class="ml-25">
                          <b-card-text class="mb-0 font-weight-bold">
                            {{ listItem.appointment_name }}-{{ listItem.name }}
                          </b-card-text>
                        </div>
                      </div>
                    </b-list-group-item>
                  </draggable>
                </vue-perfect-scrollbar>
              </b-form-group>
            </b-col>
          </b-row>

          <b-col md="13">
            <b-form-group label-for="comment">
              <template #label>
                Comment <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="comment"
                :rules="{
                  required: !draft,
                  regex: regexPattern,
                  max: 2000,
                }"
              >
                <b-form-textarea
                  id="comment"
                  v-model="comment"
                  placeholder="Comment"
                  maxlength="2001"
                  rows="2"
                  class="char-textarea"
                  :class="
                    comment.length === 0 || comment.length >= maxCommentCount
                      ? 'text-danger'
                      : ''
                  "
                  required
                ></b-form-textarea>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-col>
      </b-row>

      <b-row class="m-50">
        <b-col md="6">
          <div style="border: 2px solid black; border-radius: 8px">
            <b-row>
              <b-col :md="president ? '12' : '9'" class="m-50">
                <h3>President <span class="text-danger">*</span></h3>

                <b-row class="m-1" v-if="president != null">
                  <b-col v-if="caseObject">
                    <PesronTable
                      :members="[president]"
                      :context="'president'"
                      :allowEdit="this.allowEdit"
                      :mode="this.mode"
                      @changePresident="changePresident"
                    />
                  </b-col>
                  <b-col v-else>
                    <PesronTable
                      :members="[president]"
                      :context="'president'"
                      :allowEdit="this.allowEdit"
                      :mode="this.mode"
                      @changePresident="changePresident"
                    />
                  </b-col>
                </b-row>
              </b-col>

              <b-col v-if="!president" md="2" class="m-50">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="president"
                  vid="president"
                >
                  <b-button
                    variant="primary"
                    size="sm"
                    @click="createMember(1)"
                  >
                    <feather-icon icon="PlusIcon" class="mr-25" />
                    <span>Add</span>
                  </b-button>

                  <span class="text-danger">{{
                    errors.length > 0 ? "President Required" : ""
                  }}</span>
                </validation-provider>
              </b-col>
            </b-row>
          </div>
        </b-col>
        <b-col md="6">
          <div style="border: 2px solid black; border-radius: 8px">
            <b-row>
              <b-col :md="ordered_by ? '12' : '9'" class="m-50">
                <h3>Ordered By <span class="text-danger">*</span></h3>

                <b-row class="m-1" v-if="ordered_by != null">
                  <b-col v-if="caseObject">
                    <PesronTable
                      :members="[ordered_by]"
                      :context="'normal'"
                      :allowEdit="this.allowEdit"
                      :mode="this.mode"
                      @changePresident="changePresident"
                    />
                  </b-col>
                  <b-col v-else>
                    <PesronTable
                      :members="[ordered_by]"
                      :context="'normal'"
                      :allowEdit="this.allowEdit"
                      :mode="this.mode"
                      @changePresident="changePresident"
                    />
                  </b-col>
                </b-row>
              </b-col>
              <b-col v-if="!ordered_by" md="2" class="m-50">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="ordered by"
                  vid="ordered_by"
                >
                  <b-button
                    variant="primary"
                    size="sm"
                    @click="createMember(2)"
                  >
                    <feather-icon icon="PlusIcon" class="mr-25" />
                    <span>Add</span>
                  </b-button>
                  <span class="text-danger">{{
                    errors.length > 0 ? "Ordered By Required" : ""
                  }}</span>
                </validation-provider>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </div>
    <LinkedCivilianModal
      @addCivilians="addCivilians"
      :key="`civ-create-${LinkedCivilianModalCount}`"
    />
    <ShowLinkedCivilian
      @refreshDataWithAward="refreshDataWithAward"
      @modalClosed="civModalClosed"
      @removeCivilian="removeCivilian"
      :data="civilians"
      :mode="this.mode"
      :case_id="caseObject ? caseObject.id : null"
      :key="`civ-show-${showCivilianModalCount}`"
    />
    <MemberCreateModal
      @addMember="addMember"
      @addOfficerInvolved="addOfficerInvolved"
      @addPresident="addPresident"
      @addOrderedBy="addOrderedBy"
      :type="type"
      :editMode="editMode"
      :key="`member-create-${createMemberModalCount}`"
    />

    <ShowLinkIndividual
      @refreshDataWithAward="refreshDataWithAward"
      @modalClosed="indvModalClosed"
      @removeIndividual="removeIndividual"
      @uploadDocAndAward="uploadDocAndAward"
      @removeCivilian="removeCivilian"
      @setIndividual="setIndividual"
      :mode="this.mode"
      :isOldInquiry="this.isOldInquiry"
      :items="individual_involved"
      :case_id="caseObject ? caseObject.id : null"
      :key="`member-show-${showMemberModalCount}`"
    />
  </div>
</template>
  
<script>
import { mapGetters, mapActions } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import { quillEditor } from "vue-quill-editor";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
// import MemberCreateModal from "@/components/member/MemberCreateModal.vue";
import MemberCreateModal from "@/components/member/MemberCreateModalUpdated.vue";
import LinkedCivilianModal from "@/components/member/LinkedCivilianModal.vue";
import ShowLinkIndividual from "@/components/member/ShowLinkIndividualModal.vue";
import ShowLinkedCivilian from "@/components/member/ShowLinkedCivilianlModal.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import PesronTable from "@/components/person/ShowPersonTable.vue";
import IndividualPersonTable from "@/components/person/ShowIndividualPersonTable.vue";
import PesronDetail from "@/components/person/ShowPersonDetail.vue";
import draggable from "vuedraggable";
import util from "@/util.js";
import { heightTransition } from "@core/mixins/ui/transition";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    quillEditor,
    VueSelectPaginated,
    VuePerfectScrollbar,
    draggable,
    MemberCreateModal,
    PesronTable,
    IndividualPersonTable,
    PesronDetail,
    LinkedCivilianModal,
    ShowLinkIndividual,
    ShowLinkedCivilian,
  },
  props: {
    item: Object,
    mode: {
      type: Number,
      default: 0,
    },
    allowEdit: {
      type: Boolean,
      default: true,
    },
    isSubmtRequested: Boolean,
    isOldInquiry: Boolean,
  },
  mixins: [util, heightTransition],
  data() {
    return {
      required,
      perfectScrollbarSettings: {
        maxScrollbarLength: 100,
        wheelPropagation: false,
        useBothWheelAxes: false,
        suppressScrollX: true,
      },
      caseObject: null,
      brief: "",
      no_of_officer: "",
      comment: "",
      remarks: "",
      members: [],
      individual_involved: [],
      civilians: [],
      createMemberModalCount: 0,
      showMemberModalCount: 0,
      LinkedCivilianModalCount: 0,
      showCivilianModalCount: 0,
      editMemberModalCount: 0,
      type: null,
      status: "",
      start_date: "",
      completion_date: "",
      ordered_by: null,
      president: null,
      availableUserList: [],
      markedUserList: [],
      noc: null,
      award: null,
      selectedOrganization: null,
      selectedMarkType: true,
      selectedNoc: null,
      selectedAward: null,
      no_of_civilain: "",
      maxCommentCount: 2000,
      unit: null,
      formation: null,
      recom: "",
      remarksRegexPattern: /^[^<>#]+$/,
      draft: false,
      editMode: false,
      fields: [
        { key: "prefix_data.name", label: "Prefix" },
        { key: "army_no", label: "Army No" },
        { key: "rank_type_data.name", label: "rank" },
        { key: "name", label: "name" },
        { key: "course", label: "course" },
        { key: "parent_unit", label: "unit" },
        // { key: "manage", label: "Manage" },
      ],
    };
  },
  async mounted() {
    this.initizlizeMethod();
    if (this.item) {
      this.individual_involved = this.item.individual_involved;
    }
    if (this.item) {
      this.civilians = this.item.civilian_involved;
    }
  },
  created() {
    window.addEventListener("resize", this.initTrHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.initTrHeight);
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
        // this.individual_involved = this.caseObject.individual_involved;
        this.start_date = this.caseObject.start_date;
        this.completion_date = this.caseObject.completion_date;
        this.status = this.caseObject.status
          ? this.statusName[this.caseObject.status]
          : "";
        this.ordered_by = this.caseObject.ordered_by_data;
        this.president = this.caseObject.president_data;
        this.noc = this.caseObject.noc ? this.caseObject.noc_data : null;
        this.award = this.caseObject.award;
        // this.civilians = this.caseObject.civilian_involved;
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
    createMember(type) {
      this.type = type;
      this.createMemberModalCount += 1;
      if (type === 5) {
        this.$nextTick(() => {
          this.$bvModal.show("linked-individual-create-modal");
        });
      } else {
        this.$nextTick(() => {
          this.$bvModal.show("member-create-modal");
        });
      }
    },
    setIndividual(item) {
      this.individual_involved.forEach((ind, index) => {
        if (!ind.pk) {
          if (ind.id == item.id) {
            ind.doc_name = item.fileName;
            ind.award_name = item.awardName;
            this.individual_involved[index] = ind;
          }
        } else {
          if (ind.id == item.id) {
            ind.doc_name = item.fileName;
            ind.award_name = item.awardName;
            this.individual_involved[index] = ind;
          }
        }
      });
    },
    openCiviliansModal() {
      this.LinkedCivilianModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("linked-civilan-modal");
      });
    },
    showLinkedCivilian() {
      this.showCivilianModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("show_linked-indv-create-modal");
      });
    },

    showLinkedIndividual() {
      this.showMemberModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("show_officer-create-modal");
      });
    },

    changePresident(type) {
      this.type = type;
      this.editMode = true;
      this.createMemberModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("member-create-modal");
      });
    },

    addPresident(person) {
      this.president = person;
      if (person.editMode) {
        this.$swal({
          title:
            "President edit successfully please click save/update button to save changes",
          icon: "success",
        });
      }
      // else{
      // this.$swal({
      //       title: "President add successfully",
      //       icon: "success",
      //     });
      //   }
    },
    addOrderedBy(person) {
      this.ordered_by = person;
      if (person.editMode) {
        this.$swal({
          title:
            "Ordered by Edit successfully please click save/update button to save changes",
          icon: "success",
        });
      }
      // else{
      // this.$swal({
      //       title: "Ordered by add successfully",
      //       icon: "success",
      //     });
      //   }
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

    removeCivilian(civ) {
      this.civilians = this.civilians.filter((i) => i.id !== civ.id);
      this.$emit("removeCivilian", civ);
      this.$swal({
        title:
          "civilian remove successfully please click update button to save changes",
        icon: "success",
      });
    },

    removeIndividual(indv) {
      this.individual_involved = this.individual_involved.filter(
        (i) => i.id !== indv.id
      );
      this.$emit("removeIndividual", indv);
      this.$swal({
        title:
          "Individual remove successfully please click update button to save changes",
        icon: "success",
      });
    },
    async onMarkTypeChange(markedType) {
      this.markedUserList = [];
      if (markedType == 1) {
        try {
          const res = await this.getOrganization({
            pk: this.getLoggedInUser.organization,
          });
          this.selectedOrganization = res.data;
        } catch (error) {
          this.displayError(error);
        }
      } else if (markedType == 2) {
        this.availableUserList = [];
        this.selectedOrganization = null;
        this.$refs.selectedOrganizationRef.clearSelected();
        return;
      }
    },
    checkMove(evt) {
      if (this.markedUserList.length > 0) {
        return false;
      }
    },
    onListChange({ removed }) {
      if (removed) {
        const users = [];
        let removedFirst = false;

        for (let i = 0; i < this.availableUserList.length; i++) {
          const element = this.availableUserList[i];
          if (element.id === removed.element.id && !removedFirst) {
            removedFirst = true;
          } else {
            users.push(element);
          }
        }

        this.availableUserList = users;
      }
    },
    async onOrganizationChange(organization) {
      if (!organization) {
        this.availableUserList = [];
        return;
      }

      try {
        const res = await this.getUsersUnPaginated({
          organization: organization.id,
        });
        this.availableUserList = res.data;
      } catch (error) {
        this.displayError(error);
      }
      this.selectedOrganization = null;
    },

    async onModalClosed() {
      await this.fetchPaginatedData();
    },
    async civModalClosed() {},
    async indvModalClosed() {},
    setDraft(draft) {
      this.draft = draft;
    },

    uploadDocAndAward(data) {
      this.$emit("uploadDocAndAward", data);
    },
  },
  computed: {
    ...mapGetters({
      getLoggedInUser: "appData/getLoggedInUser",
      hasPermission: "appData/hasPermission",
    }),
    regexPattern() {
      return this.remarksRegexPattern;
    },
  },
  watch: {
    item() {
      this.initizlizeMethod();
    },
    civilians() {
      this.no_of_civilain = this.civilians.length;
    },
    individual_involved() {
      this.no_of_officer = this.individual_involved.length;
    },
  },
};
</script>
  
<style>
.vSelectStyle .vs__deselect {
  fill: #fff !important;
}

.scroll-area-size {
  height: 30vh;
}

.scroll-area-size ul {
  height: 100%;
}

.repeater-form {
  overflow: hidden;
  transition: 0.35s height;
}
</style>
  