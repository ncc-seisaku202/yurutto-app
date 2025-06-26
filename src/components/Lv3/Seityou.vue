<template>
  <div class="tree-container">
    <svg width="300" height="400" v-if="stage === '芽'">
      <!-- 芽 -->
      <circle cx="150" cy="250" r="6" fill="green" />
      <rect x="147" y="256" width="6" height="20" fill="#8B4513" />
    </svg>

    <svg width="300" height="400" v-else-if="stage === '苗木'">
      <!-- 苗木 -->
      <rect x="145" y="220" width="10" height="80" fill="#8B4513" />
      <circle cx="150" cy="210" r="15" fill="forestgreen" />
    </svg>

    <svg width="300" height="400" v-else-if="stage === '若木'">
      <!-- 若木 -->
      <rect x="140" y="180" width="20" height="120" fill="#8B4513" />
      <circle cx="150" cy="150" r="25" fill="forestgreen" />
      <circle cx="125" cy="160" r="18" fill="seagreen" />
      <circle cx="175" cy="160" r="18" fill="seagreen" />
    </svg>

    <svg width="300" height="400" v-else>
      <!-- 大樹（前回と同じ内容） -->
      <rect x="140" y="200" width="20" height="170" fill="#8B4513" rx="5" />
      <circle cx="150" cy="130" r="30" fill="forestgreen" />
      <circle cx="120" cy="140" r="25" fill="green" />
      <circle cx="180" cy="140" r="25" fill="green" />
      <circle cx="100" cy="160" r="20" fill="darkgreen" />
      <circle cx="200" cy="160" r="20" fill="darkgreen" />
      <circle cx="130" cy="110" r="20" fill="seagreen" />
      <circle cx="170" cy="110" r="20" fill="seagreen" />
      <circle cx="110" cy="180" r="18" fill="limegreen" />
      <circle cx="190" cy="180" r="18" fill="limegreen" />
      <circle cx="150" cy="170" r="22" fill="mediumseagreen" />
      <circle cx="135" cy="210" r="12" fill="lightgreen" />
      <circle cx="165" cy="210" r="12" fill="lightgreen" />
    </svg>

    <p class="text-center mt-2">
      🧪 経験値: {{ exp }}<br />
      🌿 今の状態: {{ stage }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'TreeGrowth',
  props: {
    exp: {
      type: Number,
      required: true,
    },
  },
  computed: {
    stage() {
      if (this.exp <= 10) return '芽';
      if (this.exp <= 30) return '苗木';
      if (this.exp <= 70) return '若木';
      return '大樹';
    },
  },
};
</script>

<style scoped>
.tree-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
