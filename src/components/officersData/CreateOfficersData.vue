<template>
    <b-modal
      id="officers-create-modal"
      title="Officers Create Modal"
      centered
      hide-footer
      size="xl"
      @hidden="reset"
      :no-close-on-esc="true"
      :no-close-on-backdrop="true"
    >
      <template #modal-title>
        <h2 class="m-0">CREATE OFFICER BASIC DATA</h2>
      </template>

      <b-card class="mb-3">
       <h4 class="text-primary" style="text-align: center; font-size: 26px; color: black !important;">Currently Logged-in User: <strong> {{ getLoggedInUser ? getLoggedInUser.rank_name  : 'None' }} - {{ getLoggedInUser ? getLoggedInUser.name  : getLoggedInUser.username }} </strong></h4>
      </b-card>
      <validation-observer ref="officersCreateFormValidation">
        <b-form @submit.prevent>
          <b-form-row class="mt-2 mb-2">
            <b-col md="3">
              <b-form-radio-group 
                 v-model="personField" 
                 :options="[{text: 'Self', value: true}, {text: 'Other', value: false}]">
            </b-form-radio-group>
            </b-col>
            <b-col md="4">
              <b-form-group label-for="name">
                  <template #label v-if="personField == false">
                    Reason
                    <span class="text-danger">*</span>
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="Reason"
                    :rules="{ required, regex: /^[A-Z\s]*$/i }"
                    v-if="personField == false"
                  >
                    <b-form-input
                      id="reason"
                      v-model="reason"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Reason for data entry other officers.."
                      v-if="personField == false"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
            </b-col>
            <b-col md="5"></b-col>
          </b-form-row>

          <b-form-row class="mb-2">
            <b-col md="3">
              <b-form-group label-for="Srv-no">
                    <VueSelectPaginated
                        name="Prefix"
                        label="name"
                        :prevSelected="selectedType"
                        :getListMethod="getPrefixes"
                        :rules="{ required }"
                        @setMethod="
                          (value) => {
                            selectedType = value;
                          }
                        "
                        searchBy="name"
                      />
              </b-form-group>
            </b-col>
            
            <b-col md="3">
              <b-form-group label-for="number">
                  <template #label>
                    Service Number
                    <span class="text-danger">*</span>
                      </template>
                  <validation-provider #default="{ errors }" name="Service Number"
                                      :rules="{ required, regex: /^[0-9\s]*$/i }">
                                      <b-form-input id="srv-number" v-model="enteredNumber" :state="errors.length > 0 ? false : null"
                                          placeholder="Number"/>
                                      <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>  
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group label-for="name">
                  <template #label>
                    Name 
                    <span class="text-danger">*</span>
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="Name"
                    :rules="{ required, regex: /^[A-Z\s]*$/i }"
                  >
                    <b-form-input
                      id="name"
                      v-model="name"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Name"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group label="Ranks" label-for="rank">
                    <v-select
                      id="rank"
                      v-model="rank"
                      :options="ranksList"
                      placeholder="Ranks"
                      label="name"
                    />
              </b-form-group>
            </b-col>
          </b-form-row>
          
          <b-form-row class="mb-2">
            <b-col md="3">
              <b-form-group label-for="pmaCourse">
                  <template #label>
                    PMA Course 
                    <span class="text-danger">*</span>
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="PMA Course"
                    :rules="{ required, regex: /^[A-Z 0-9\-s]*$/i }"
                  >
                    <b-form-input
                      id="pmaCourse"
                      v-model="pmaCourse"
                      :state="errors.length > 0 ? false : null"
                      placeholder="PMA Course"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
            </b-col>

            <b-col md="3">
              <VueSelectPaginated
                name="Unit"
                label="name"
                :rules="{ required: true }"
                :prevSelected="unit"
                :getListMethod="getOrganizations"
                @setMethod="
                  (value) => {
                    unit = value;
                  }
                "
                searchBy="name"
              />
            </b-col>

            <b-col md="3">
              <VueSelectPaginated
                name="Formation"
                label="name"
                :rules="{ required: true }"
                :prevSelected="formation"
                :parameters="{
                  organization_relation: true,
                }"
                :getListMethod="getOrganizations"
                @setMethod="
                  (value) => {
                    formation = value;
                  }
                "
                searchBy="name"
              />
            </b-col>

            <b-col md="3">
              <b-form-group label-for="email">
                  <template #label>
                    Email 
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="Email"
                  >
                    <b-form-input
                      id="email"
                      v-model="email"
                      :state="errors.length > 0 ? false : null"
                      type="email"
                      placeholder="Email"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
            </b-col>

          </b-form-row>

          <b-form-row class="mb-2">
            <b-col md="3">
              <b-form-group label-for="number">
                  <template #label>
                    Mobile No
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="Mobile No"
                    rules = "integer|length:11|required"
                  >
                    <b-form-input
                      id="mobileNo"
                      v-model="mobileNo"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                      placeholder="Mobile Number"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group label-for="number">
                  <template #label>
                    Whatsapp No 
                  </template>
                  <validation-provider
                    #default="{ errors }"
                    name="Whatsapp No"
                    rules = "integer|length:11"
                  >
                    <b-form-input
                      id="whatsappNo"
                      v-model="whatsappNo"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                      placeholder="Whatsapp Number"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
            </b-col>

            <b-col md="3">
            <b-form-group label-for="cnic">
                <template #label>
                    CNIC 
                  <span class="text-danger">*</span>
                </template>
              <validation-provider
                #default="{ errors }"
                name="cnic"
                :rules="{ required, regex:  /^[0-9\-s]*$/i }"
              >
                <b-form-input
                  id="cnic"
                  v-model="cnic"
                  :state="errors.length > 0 ? false : null"
                  @input="formatCNIC"
                  placeholder="XXXXX-XXXXXXX-X"
                  maxlength="15"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            </b-col>

            <b-col md="3">
                  <b-form-group label="Wards of" label-for="wardsOf">
                    <validation-provider
                      #default="{ errors }"
                      name="wards Of"
                      :rules="{ required }"
                    >
                    <v-select
                      id="wardsOf"
                      v-model="wardsOf"
                      :options="wardsOptions"
                      placeholder="Wards"
                      label="name"
                      @setMethod="(value) => (wardsOf = value)"
                      searchBy="name"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                   </validation-provider>
                  </b-form-group>
                
            </b-col>
          </b-form-row>

          <b-form-row>
            <b-col md="5">
              <b-form-group label-for="presentAddress">
              <template #label>
                Present Address <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Present Address"
                :rules="{ required, regex: regexPattern, max: 1000 }"
              >
                <b-form-textarea
                  id="Present Address"
                  v-model="presentAddress"
                  maxlength="1001"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Present Address"
                  rows="2"
                  class="char-textarea"
                ></b-form-textarea>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            </b-col>

            <b-col md="5">
              <b-form-group label-for="permanentAddress">
              <template #label>
                Permanent Address <span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="Permanent Address"
                :rules="{ required, regex: regexPattern, max: 1000 }"
              >
                <b-form-textarea
                  id="permanentAddress"
                  v-model="permanentAddress"
                  maxlength="1001"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Permanent Address"
                  rows="2"
                  class="char-textarea"
                  :disabled="sameAsPresentAddress" 
                ></b-form-textarea>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            </b-col>

            <b-col md="2" class="pt-3" >
              <b-form-group>
                <b-form-checkbox 
                v-model="sameAsPresentAddress"
                >
                  Same as Present Address
                </b-form-checkbox>
              </b-form-group>
            </b-col>

          </b-form-row>

          <b-form-group class="mt-2 text-right">
            <b-button
              type="submit"
              variant="danger"
              pill
              class="mr-1"
              @click="closeOfficerCreateModal"
            >
              Exit
            </b-button>
            <b-button
              type="reset"
              variant="secondary"
              @click="reset"
              pill
              class="mr-1"
            >
              Reset
            </b-button>
            <b-button
              type="submit"
              variant="primary"
              pill
              class="mr-1"
              @click="validationForm"
            >
              Save
            </b-button>
            
          </b-form-group>
        </b-form>
      </validation-observer>
      <b-overlay :show="show" variant="white" spinner-variant="primary" no-wrap />
    </b-modal>
  </template>
    
    <script>
  import { mapActions, mapGetters } from "vuex";
  import { ValidationProvider, ValidationObserver } from "vee-validate";
  import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
  import { required } from "@validations";
  import util from "@/util.js";
  
  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
      VueSelectPaginated,
    },
    mixins: [util],
    data() {
      return {
        required,
        reason: "",
        personField: true,
        selectedType: { name: "None", id: 999 }, // Add selectedType
        enteredNumber: "", // Add enteredNumber
        name: "",
        pmaCourse: "",
        unit: null,
        formation: null,
        email: "",
        mobileNo: "",
        whatsappNo: "",
        cnic: "",
        presentAddress: "",
        remarksRegexPattern: /^[^]+$/,
        permanentAddress: "",
        rank:null,
        wardsOf: "",
        show: false,
        typeName: null,
        serviceName: null,
        sameAsPresentAddress: false, // Add data property
        ranksList: [],
      };
    },
    async mounted() {
      this.fetchUnpaginatedRanks()
    },
    methods: {
      ...mapActions({
        getOrganizations: "appData/getOrganizations",
        getPrefixes: "appData/getDropDownPrefixes",
        getRankTypes: "appData/getRanksList",
        createOfficersData: "appData/createOfficersData",

        }),
      async validationForm() {
        const success = await this.$refs.officersCreateFormValidation.validate();
        if (success) {
          await this.submit();
        }
      },
      async submit() {
        this.show = true;
        try {
          if (this.selectedType) {
            this.typeName = typeof this.selectedType === 'object' ? this.selectedType.name : this.selectedType;
            if (this.typeName === 'None'){
              this.serviceName = this.enteredNumber;
            }
            else  {
              this.serviceName = `${this.typeName}-${this.enteredNumber}`;
            }
          }

          if (!this.selectedType) {
            this.serviceName = this.enteredNumber;
          }

          // if (this.sameAsPresentAddress) {
          //   this.sameAsPresentAddress = true;
          // } else {
          //   this.sameAsPresentAddress = false;
          // }
          
          const res = await this.createOfficersData({
            reason: this.reason,
            name: this.name,
            svc_number: this.serviceName,
            email: this.email,
            cnic: this.cnic,
            mobile: this.mobileNo,
            whatsapp_no: this.whatsappNo,
            pma_course: this.pmaCourse.toUpperCase(), 
            permanent_address: this.permanentAddress,
            present_address: this.presentAddress,
            wards: this.wardsOf ? this.wardsOf.value: "",
            rank: this.rank ? this.rank.id : null,
            unit: this.unit ? this.unit.id : null,
            formation: this.formation ? this.formation.id : null,
            form_filled_by: this.personField ? 'self' : 'other',
            // same_as_present_address: this.sameAsPresentAddress,
            created_by: this.getLoggedInUser.id,
            updated_by: this.getLoggedInUser.id,
          });
          if (res.status === 201) {
            this.$swal({
              title: "Officers Data created successfully",
              icon: "success",
            });
            this.show = false;
            this.reset();
            this.$nextTick(() => {
              this.$bvModal.hide("officers-create-modal");
            });
            this.$emit("modalClosed");
          }
        } catch (error) {
          this.show = false;
          this.displayError(error);
        }
      },
      reset() {
        this.personField = true;
      },
      closeOfficerCreateModal() {
      this.$nextTick(() => {
        this.$bvModal.hide("officers-create-modal");
      });
      this.$emit("modalClosed");
    },
    formatCNIC() {
      let value = this.cnic.replace(/\D/g, ""); // Remove all non-numeric characters
      if (value.length > 5) {
        value = `${value.slice(0, 5)}-${value.slice(5)}`;
      }
      if (value.length > 13) {
        value = `${value.slice(0, 13)}-${value.slice(13)}`;
      }
      this.cnic = value;
    },
    async fetchUnpaginatedRanks(){
        try {
          const res3 = await this.getRankTypes();
          this.ranksList = res3.data;
      }
        catch (error) {
          this.displayError(error);
      }
    },
    },
    computed: {
      ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
      regexPattern() {
      return this.remarksRegexPattern;
    },
    },
    watch: {
    sameAsPresentAddress(newVal) {
      if (newVal) {
        this.permanentAddress = this.presentAddress;
      } else {
        this.permanentAddress = "";
      }
    },
    presentAddress(newVal) {
      if(newVal) {
        if (this.sameAsPresentAddress) {
          this.permanentAddress = newVal;
        }
      }
    },
  },
  };
  </script>
    
    <style></style>
    