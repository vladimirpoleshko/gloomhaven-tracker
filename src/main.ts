import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { persistStore } from '@/composables/usePersistedState';
import { useScenarioStore } from '@/stores/scenario';
import { useActiveMonstersStore } from '@/stores/activeMonsters';
import { useAbilityDecksStore } from '@/stores/abilityDecks';
import { useAttackModifierStore } from '@/stores/attackModifier';
import './styles/global.scss';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Wire up persistence after Pinia is installed but before mount.
persistStore(useScenarioStore(), 'scenario');
persistStore(useActiveMonstersStore(), 'activeMonsters');
persistStore(useAbilityDecksStore(), 'abilityDecks');
persistStore(useAttackModifierStore(), 'attackModifier');

app.mount('#app');
