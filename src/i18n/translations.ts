import type { Language } from './types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appTitle: "Harmony Tutor",
    appSubtitle: "Master music theory through practice.",
    midiConnected: "MIDI Connected",
    midiDisconnected: "MIDI Disconnected",
    midiOn: "MIDI On",
    midiOff: "MIDI Off",
    currentLesson: "Current Lesson",
    task: "Task",
    of: "of",
    checkAnswer: "Check Answer",
    nextQuestion: "Next Question",
    correct: "Correct!",
    incorrect: "Incorrect. Try again!",
    playNotes: "Play notes...",
    loading: "Loading questions...",
    library: "Library"
  },
  ru: {
    appTitle: "Гармония Тьютор",
    appSubtitle: "Освойте теорию музыки через практику.",
    midiConnected: "MIDI Подключено",
    midiDisconnected: "MIDI Отключено",
    midiOn: "MIDI Вкл",
    midiOff: "MIDI Выкл",
    currentLesson: "Текущий урок",
    task: "Задание",
    of: "из",
    checkAnswer: "Проверить",
    nextQuestion: "Следующий вопрос",
    correct: "Правильно!",
    incorrect: "Неверно. Попробуйте еще раз!",
    playNotes: "Сыграйте ноты...",
    loading: "Загрузка вопросов...",
    library: "Библиотека"
  }
};
