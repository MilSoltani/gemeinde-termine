<script setup lang="ts">
import { ref } from 'vue'

const showHelp = ref(false)
</script>

<template>
  <button
    class="help-button"
    @click="showHelp = true"
  >
    🛈 Einleitung
  </button>

  <div
    v-if="showHelp"
    class="help-overlay"
    @click.self="showHelp = false"
  >
    <div class="help-dialog">
      <div class="help-header">
        <h2>🛈 Einleitung</h2>

        <button @click="showHelp = false">
          ✕
        </button>
      </div>

      <div class="help-content">
        <div class="help-section">
          <h3>Anfangsmonat auswählen</h3>

          <p>
            Der ausgewählte Monat bestimmt den sichtbaren Kalender.
          </p>

          <p>
            Angezeigt werden immer der gewählte Monat und der Folgemonat.
          </p>

          <p>
            Über „Drucken / PDF speichern“ kann der Kalender als PDF exportiert oder direkt gedruckt werden.
          </p>
        </div>

        <div class="help-section">
          <h3>Termin hinzufügen / bearbeiten</h3>

          <p>
            Titel, Datum und Uhrzeit eingeben und anschließend speichern.
          </p>

          <p>
            Ein Klick auf einen bestehenden Termin lädt ihn zur Bearbeitung.
          </p>
        </div>

        <div class="help-section">
          <h3>Notizen zu Terminen</h3>

          <p>
            Zu jedem Termin können optionale Notizen gespeichert werden.
          </p>

          <p>
            Diese Notizen erscheinen nicht im Kalender-Tag selbst, sondern nur als Referenzmarkierung im Monatsbereich.
          </p>

          <p>
            Gleiche Notizen werden im jeweiligen Monat gruppiert und unten als Übersicht angezeigt.
          </p>

          <p>
            Im Kalender werden sie mit Stern-Symbolen (*) markiert, um die Zuordnung zu erleichtern.
          </p>
        </div>

        <div class="help-section">
          <h3>Monat löschen</h3>

          <p>
            Entfernt alle Termine eines ausgewählten Monats dauerhaft.
          </p>
        </div>

        <div class="help-section">
          <h3>Automatische Speicherung</h3>

          <p>
            Alle Termine und Einstellungen werden automatisch im Browser gespeichert (LocalStorage).
          </p>

          <ul>
            <li>
              Daten bleiben nach dem Schließen des Tabs oder Browsers erhalten.
            </li>

            <li>
              Speicherung gilt nur für dieses Gerät und diesen Browser.
            </li>

            <li>
              Keine Synchronisation zwischen mehreren Geräten.
            </li>

            <li>
              Löschen von Browserdaten entfernt auch alle Termine.
            </li>

            <li>
              Daten sind nicht servergesichert und können verloren gehen (z. B. bei Cache-Leerung).
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  padding: 10px 14px;
  border: 0;
  border-radius: 999px;
  background: #181818;
  color: white;
  cursor: pointer;
}

.help-overlay {
  position: fixed;
  inset: 0;
  z-index: 99998;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
}

.help-dialog {
  width: min(800px, calc(100vw - 40px));
  padding: 1rem;
  border-radius: 12px;
  background: white;
  box-sizing: border-box;
  font-size: 12px;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.help-header h2 {
  margin: 0;
}

.help-header button {
  border: 0;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.help-content ul {
  padding-left: 20px;
}

.help-content li {
  margin-bottom: 0.75rem;
}

@media print {
  .help-button,
  .help-overlay {
    display: none !important;
  }
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.help-section h3 {
  margin: 0 0 0.4rem;

  font-size: 16px;
}

.help-section p {
  margin: 0.25rem 0;

  line-height: 1.5;
}

.help-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 99999;

  pointer-events: auto;
}
</style>
