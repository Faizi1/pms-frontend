<template>
    <div>
        <b-modal id="case-edit-modal" title="RFA Edit Modal" centered hide-footer size="lg" :no-close-on-esc="true"
            :no-close-on-backdrop="true">
            <template #modal-title>
                <h2 class="m-0">Edit RFA</h2>
            </template>
            <validation-observer ref="petitionEditFormValidation">
                <b-form @submit.prevent>
                    <b-row>
                        <b-col md="6">
                            <b-form-group label-for="title">
                                <template #label>
                                    Title
                                    <span class="text-danger">*</span>
                                </template>
                                <validation-provider #default="{ errors }" name="Title"
                                    :rules="{ required, regex: /^[A-Z0-9\s]*$/i }">
                                    <b-form-input id="title" v-model="title" :state="errors.length > 0 ? false : null"
                                        placeholder="Title" />
                                    <small class="text-danger">{{ errors[0] }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group label-for="subject">
                                <template #label>
                                    Subject
                                    <span class="text-danger">*</span>
                                </template>
                                <validation-provider #default="{ errors }" name="Subject"
                                    :rules="{ required, regex: /^[A-Z0-9\s]*$/i }">
                                    <b-form-input id="subject" v-model="subject" :state="errors.length > 0 ? false : null"
                                        placeholder="Subject" />
                                    <small class="text-danger">{{ errors[0] }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col md="12">
                            <b-form-group label="Uploaded Documents">
                                <div class="d-flex flex-wrap">
                                    <b-badge pill variant="primary" v-for="(file, index) in prevDocuments"
                                        :key="`file-${index}`" class="mr-50 mt-50 cursor-pointer"
                                        @click="openFile(file.path)">
                                        {{ file.name }}
                                    </b-badge>
                                </div>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row align-v="center">
                        <b-col md="9">
                            <VueSelectPaginated name="Documents" label="name" :multiple="true" :parameters="{
                                created_by: getLoggedInUser ? getLoggedInUser.id : null,
                            }" :getListMethod="getDocuments" @setMethod="(value) => (documents = value)"
                                :key="documentsKey" />
                        </b-col>
                        <b-col md="3">
                            <b-button variant="primary" @click="createDocument" class="mt-50"
                                v-if="hasPermission('document_create')">
                                <feather-icon icon="PlusIcon" class="mr-50" />
                                <span class="align-middle">Upload</span>
                            </b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col md="12">
                            <b-form-group>
                                <template #label>
                                    Content
                                    <span class="text-danger">*</span>
                                </template>
                                <quill-editor v-model="content" :options="option" />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-form-group class="mt-1 text-right">
                        <b-button type="submit" variant="info" pill class="mr-1" @click="validationForm">
                            Update
                        </b-button>
                    </b-form-group>
                </b-form>
            </validation-observer>
        </b-modal>
        <!-- <document-create-modal
        id="edit-modal-document-create-modal"
        @modalClosed="onModalClosed"
        :key="`create-${documentCreateModalCount}`"
      /> -->
    </div>
</template>
  
<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import { quillEditor } from "vue-quill-editor";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import draggable from "vuedraggable";
import util from "@/util.js";
//   import DocumentCreateModal from "@/components/document/DocumentCreateModal.vue";

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
        quillEditor,
        VueSelectPaginated,
        VuePerfectScrollbar,
        draggable,
        //   DocumentCreateModal,
    },
    props: {
        petition: Object,
    },
    mixins: [util],
    data() {
        return {
            required,
            perfectScrollbarSettings: {
                maxScrollbarLength: 100,
                wheelPropagation: false,
                useBothWheelAxes: false,
                suppressScrollX: true,
            },
            title: "",
            subject: "",
            content: "",
            documents: [],
            prevDocuments: [],
            documentsKey: 0,
            documentCreateModalCount: 0,
            option: {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],

                        ["bold", "italic", "underline", "strike"], // toggled buttons

                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ align: [] }],
                        [{ script: "sub" }, { script: "super" }], // superscript/subscript
                        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                        [{ direction: "rtl" }], // text direction

                        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                        [{ font: [] }],
                    ],
                },
            },
        };
    },
    mounted() {
        if (this.petition) {
            this.title = this.petition.title;
            this.subject = this.petition.subject;
            this.content = this.petition.content;

            this.prevDocuments = this.petition.documents;
        }
    },
    methods: {
        ...mapActions({
            updatePetition: "appData/updatePetition",
            getDocuments: "appData/getDocuments",
        }),
        async upload(event) {
            this.documentError = 0;

            const files = event.target.files;
            if (files.length > this.maxFilesCount) {
                this.documentError = 1;
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const ext = file.name.slice(
                    ((file.name.lastIndexOf(".") - 1) >>> 0) + 1
                );
                if (file.size > this.maxFileSize * 100 * 1024) {
                    this.documentError = 2;
                    return;
                }
                if (!this.acceptedFiles.includes(ext)) {
                    this.documentError = 3;
                    return;
                }
            }

            for (let i = 0; i < files.length; i++) {
                this.files.push(files[0]);
            }
        },
        async validationForm() {
            const success = await this.$refs.petitionEditFormValidation.validate();
            if (success) {
                await this.submit();
            }
        },
        async submit() {
            try {
                const documents_id = this.documents.map((document) => {
                    return document.id;
                });

                const data = {
                    title: this.title,
                    subject: this.subject,
                    content: this.content,
                    draft: this.draft,
                    history: [],
                    documents_id: documents_id,
                    updated_by: this.getLoggedInUser.id,
                };

                const res = await this.updatePetition({
                    payload: data,
                    pk: this.petition.id,
                });
                if (res.status === 200) {
                    this.$swal({
                        title: "RFA updated successfully",
                        icon: "success",
                    });
                    this.$nextTick(() => {
                        this.$bvModal.hide("petition-edit-modal");
                    });
                    this.$emit("modalClosed");
                }
            } catch (error) {
                console.log(error);
                this.displayError(error);
            }
        },
        createDocument() {
            this.documentCreateModalCount += 1;
            this.$nextTick(() => {
                this.$bvModal.show("edit-modal-document-create-modal");
            });
        },
        async onModalClosed() {
            this.documentsKey += 1;
        },
    },
    computed: {
        ...mapGetters({
            getLoggedInUser: "appData/getLoggedInUser",
            hasPermission: "appData/hasPermission",
        }),
    },
};
</script>
  
<style lang="scss" scoped>
@import "@core/scss/vue/libs/quill.scss";

.scroll-area-size {
    height: 30vh;
}

.vSelectStyle .vs__deselect {
    fill: #fff !important;
}
</style>