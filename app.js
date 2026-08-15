import { createApp } from "/vendor/vue.esm-browser.prod.js";
import { calculateSprintValueAdapter } from "./src/index.js";

const DEFAULT_FORM = Object.freeze({
  developers: 1,
  developmentHoursPerDay: 6,
  sprintDurationDays: 10,
  hasRnf: false,
  storyPoints: 0,
  pointValue: 4,
  technicalRefinementHours: 26,
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
      ];
    },
    resultMetrics() {
      if (!this.lastResult) return [];
      
      const metrics = Object.values(this.lastResult.data.output);
      
      return metrics.map(metric => {
        const label = metric.label || '';
        
        let category = 'capacity';
        
        // Esforço base e refinamento técnico ficam em capacity
        if (label === 'Esforço base da história' || label.includes('Refinamento técnico') || label === 'Com refinamento técnico') {
          category = 'capacity';
        }
        // Métricas de análise da sprint ficam em story
        else if (label.includes('necessários') || label.includes('Cabe no sprint') || label.includes('Dias restantes') || label.includes('Duração do sprint')) {
          category = 'story';
        }
        // RNF tem categoria própria
        else if (label.includes('RNF') && !label.includes('percentual')) {
          category = 'rnf';
        }
        
        return {
          ...metric,
          category,
          isRnfRelated: label.includes('RNF'),
          isAllocated: label.includes('alocados'),
        };
      });
    },
    capacityMetrics() {
      const metrics = this.resultMetrics.filter(m => m.category === 'capacity' && !m.isRnfRelated);
      
      // Define ordem lógica para métricas de capacidade
      const order = [
        'Capacidade total do sprint',
        'Capacidade diária total',
        'Devs funcionais',
        'Capacidade funcional do sprint',
        'Capacidade diária funcional',
        'Esforço base da história',
        'Refinamento técnico',
        'Com refinamento técnico'
      ];
      
      return metrics.sort((a, b) => {
        const indexA = order.indexOf(a.label);
        const indexB = order.indexOf(b.label);
        
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        
        return indexA - indexB;
      });
    },
    storyMetrics() {
      const metrics = this.resultMetrics.filter(m => m.category === 'story');
      
      // Define ordem lógica para métricas de história
      const order = [
        'Esforço base da história',
        'Refinamento técnico',
        'Com refinamento técnico',
        'Número de dias necessários',
        'Duração do sprint (dias)',
        'Cabe no sprint',
        'Dias restantes'
      ];
      
      return metrics.sort((a, b) => {
        const indexA = order.indexOf(a.label);
        const indexB = order.indexOf(b.label);
        
        // Se não estiver na lista, deixa no final
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        
        return indexA - indexB;
      });
    },
    rnfMetrics() {
      return this.resultMetrics.filter(m => m.isRnfRelated);
    },
    hasRnfMetrics() {
      return this.rnfMetrics.length > 0;
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
        sprintDurationDays: Number(this.form.sprintDurationDays),
        hasRnf: Boolean(this.form.hasRnf),
        storyPoints: Number(this.form.storyPoints),
        pointValue: Number(this.form.pointValue),
      };

      const policy = {
        technicalRefinementHours: Number(this.form.technicalRefinementHours),
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
            <div class="form-section">
              <h3>Sprint Setup</h3>
              
              <label>
                <span>Quantidade de desenvolvedores</span>
                <input v-model.number="form.developers" type="number" min="1" step="1" />
              </label>

              <label>
                <span>Horas de desenvolvimento por dia</span>
                <input v-model.number="form.developmentHoursPerDay" type="number" min="1" step="1" />
              </label>

              <label>
                <span>Duração da sprint (dias)</span>
                <input v-model.number="form.sprintDurationDays" type="number" min="1" step="1" />
              </label>

              <label class="checkbox-label">
                <input v-model="form.hasRnf" type="checkbox" />
                <span>Incluir RNF</span>
              </label>
            </div>

            <div class="form-section">
              <h3>Story Sizing</h3>
              
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
            </div>

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
            <h2>Dashboard integrado</h2>
          </div>

          <div v-if="!hasResult" class="empty-state">
            <p>Preencha os campos e execute o cálculo para visualizar os valores intermediários e finais.</p>
          </div>

          <div v-else class="results-dashboard">
            <div class="dashboard-section">
              <h3>Sprint Capacity</h3>
              <div class="results-grid">
                <article class="result-card" v-for="metric in capacityMetrics" :key="metric.label">
                  <div class="title">{{ metric.label }}</div>
                  <div class="value">{{ formatMetricValue(metric) }}</div>
                  <div class="formula">Fórmula: {{ metric.formula }}</div>
                  <div v-if="formatRawValue(metric)" class="raw">{{ formatRawValue(metric) }}</div>
                </article>
              </div>
            </div>

            <div class="dashboard-section">
              <h3>Story Analysis</h3>
              <div class="results-grid">
                <article class="result-card" v-for="metric in storyMetrics" :key="metric.label">
                  <div class="title">{{ metric.label }}</div>
                  <div class="value">{{ formatMetricValue(metric) }}</div>
                  <div class="formula">Fórmula: {{ metric.formula }}</div>
                  <div v-if="formatRawValue(metric)" class="raw">{{ formatRawValue(metric) }}</div>
                </article>
              </div>
            </div>

            <div class="dashboard-section" v-if="hasRnfMetrics">
              <h3>RNF Allocation</h3>
              <div class="results-grid">
                <article class="result-card" v-for="metric in rnfMetrics" :key="metric.label">
                  <div class="title">{{ metric.label }}</div>
                  <div class="value">
                    <span v-if="metric.isAllocated">🔒 </span>{{ formatMetricValue(metric) }}
                  </div>
                  <div class="formula">Fórmula: {{ metric.formula }}</div>
                  <div v-if="formatRawValue(metric)" class="raw">{{ formatRawValue(metric) }}</div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
}).mount("#app");
