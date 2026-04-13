import { createApp } from "/node_modules/vue/dist/vue.esm-browser.prod.js";
import { calculateSprintValueAdapter } from "./src/index.js";

const DEFAULT_FORM = Object.freeze({
  developers: 1,
  developmentHoursPerDay: 6,
  storyPoints: 0,
  pointValue: 0,
  technicalRefinementHours: 26,
  rnfDeveloperCount: 1,
});

createApp({
  data() {
    return {
      form: { ...DEFAULT_FORM },
      lastResult: null,
      errorMessage: "",
    };
  },
  computed: {
    heroMetrics() {
      return [
        {
          label: "Refinamento técnico",
          value: `${this.form.technicalRefinementHours}h`,
        },
        {
          label: "RNF",
          value: "30%",
        },
        {
          label: "RNF devs",
          value: this.form.rnfDeveloperCount,
        },
      ];
    },
    resultMetrics() {
      return this.lastResult ? Object.values(this.lastResult.data.output) : [];
    },
    hasResult() {
      return Boolean(this.lastResult);
    },
    hasError() {
      return this.errorMessage.length > 0;
    },
  },
  methods: {
    calculate() {
      const payload = {
        developers: Number(this.form.developers),
        developmentHoursPerDay: Number(this.form.developmentHoursPerDay),
        storyPoints: Number(this.form.storyPoints),
        pointValue: Number(this.form.pointValue),
      };

      const policy = {
        technicalRefinementHours: Number(this.form.technicalRefinementHours),
        rnfDeveloperCount: Number(this.form.rnfDeveloperCount),
      };

      const result = calculateSprintValueAdapter(payload, policy);

      if (!result.ok) {
        this.errorMessage = result.error.details
          .map((detail) => `${detail.field}: ${detail.message}`)
          .join(" | ");
        return;
      }

      this.errorMessage = "";
      this.lastResult = result;
    },
    resetForm() {
      this.form = { ...DEFAULT_FORM };
      this.errorMessage = "";
      this.lastResult = null;
    },
    formatMetricValue(metric) {
      return String(metric.value);
    },
    formatRawValue(metric) {
      if (typeof metric.raw !== "number") {
        return null;
      }

      return `Valor bruto: ${metric.raw}`;
    },
  },
  template: `
    <div class="page-shell">
      <header class="hero card card-glass">
        <div>
          <p class="eyebrow">Sprint Calculator</p>
          <h1>Calcule a capacidade da sprint.</h1>
        </div>

        <div class="hero-metrics">
          <div class="metric-pill" v-for="metric in heroMetrics" :key="metric.label">
            <span class="metric-label">{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
          </div>
        </div>
      </header>

      <main class="layout-grid">
        <section class="card form-card">
          <div class="section-heading">
            <p class="eyebrow">Entrada</p>
            <h2>Parâmetros da sprint</h2>
          </div>

          <form class="calculator-form" novalidate @submit.prevent="calculate">
            <label>
              <span>Quantidade de desenvolvedores</span>
              <input v-model.number="form.developers" type="number" min="1" step="1" />
            </label>

            <label>
              <span>Horas de desenvolvimento por dia</span>
              <input v-model.number="form.developmentHoursPerDay" type="number" min="1" step="1" />
            </label>

            <label>
              <span>Pontos totais da história</span>
              <input v-model.number="form.storyPoints" type="number" min="1" step="1" />
            </label>

            <label>
              <span>Valor de cada ponto</span>
              <input v-model.number="form.pointValue" type="number" min="1" step="1" />
            </label>

            <label>
              <span>Refinamento técnico (horas)</span>
              <input v-model.number="form.technicalRefinementHours" type="number" min="1" step="1" />
            </label>

            <label>
              <span>Desenvolvedores no RNF</span>
              <input v-model.number="form.rnfDeveloperCount" type="number" min="1" step="1" />
            </label>

            <div class="form-actions">
              <button type="submit" class="primary-button">Calcular sprint</button>
              <button type="button" class="secondary-button" @click="resetForm">Limpar</button>
            </div>

            <div v-if="hasError" class="feedback feedback-error">{{ errorMessage }}</div>
          </form>
        </section>

        <section class="card results-card">
          <div class="section-heading">
            <p class="eyebrow">Resultado</p>
            <h2>Valores calculados</h2>
          </div>

          <div v-if="!hasResult" class="empty-state">
            <p>Preencha os campos e execute o cálculo para visualizar os valores intermediários e finais.</p>
          </div>

          <div v-else class="results-grid">
            <article class="result-card" v-for="metric in resultMetrics" :key="metric.label">
              <div class="title">{{ metric.label }}</div>
              <div class="value">{{ formatMetricValue(metric) }}</div>
              <div class="formula">Fórmula: {{ metric.formula }}</div>
              <div v-if="formatRawValue(metric)" class="raw">{{ formatRawValue(metric) }}</div>
            </article>
          </div>
        </section>
      </main>
    </div>
  `,
}).mount("#app");
