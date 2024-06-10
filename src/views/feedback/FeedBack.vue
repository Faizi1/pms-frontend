<!-- FeedbackForm.vue -->

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg p-4">
          <h2 class="card-title text-center mb-4 text-primary">
            Feedback Form
          </h2>

          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="name" class="form-label">Name:</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email:</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label for="feedback" class="form-label">Feedback:</label>
              <textarea
                id="feedback"
                v-model="formData.feedback"
                class="form-control"
                rows="4"
                required
              ></textarea>
            </div>

            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg">
                Submit
              </button>
            </div>
          </form>

          <div v-if="submitted" class="mt-4 alert alert-success">
            <h3 class="fw-bold">
              Thank you for your feedback, {{ formData.name }}!
            </h3>
            <p>Email: {{ formData.email }}</p>
            <p>Feedback: {{ formData.feedback }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        feedback: "",
      },
      submitted: false,
    };
  },
  methods: {
    submitForm() {
      // You can perform any additional processing or send the data to a server here
      // For this example, we'll just set submitted to true
      this.submitted = true;
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 20px;
  border: none;
}

.card-title {
  font-size: 2.5rem;
  color: #343a40;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.alert-success {
  border-color: #28a745;
}

.alert-success h3 {
  color: #28a745;
}

.alert-success p {
  color: #333;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .card {
    border-radius: 0;
  }
}
</style>
