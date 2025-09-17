# 🧪 Quick Test per Pacchetti Suggesto

Questa directory contiene test rapidi per verificare che i pacchetti Suggesto pubblicati su NPM funzionino correttamente.

## 🚀 Come Usare

### Dopo aver pubblicato i pacchetti:

1. **Testa la disponibilità su NPM**:
```bash
# Dalla root del progetto
node test-packages.js
```

2. **Testa il pacchetto @suggesto/core**:
```bash
cd examples/quick-test

# Installa la versione pubblicata
npm install

# Esegui il test
npm run test-core
```

## 📋 Cosa Testano Questi Script

### `test-packages.js` (Root)
- ✅ Verifica che tutti i pacchetti esistano su NPM
- ✅ Testa l'installazione in directory temporanee
- ✅ Controlla che i file principali esistano
- ✅ Valida la struttura dei package.json

### `test-core.js` (Quick Test)
- ✅ Import del pacchetto @suggesto/core
- ✅ Creazione istanza SuggestoWidget
- ✅ Sistema di eventi
- ✅ Caricamento del widget
- ✅ Metodi API (openModal, closeModal)
- ✅ Cleanup e destroy

## 🔧 Test per Altri Pacchetti

Per testare React, Vue e Nuxt, crea progetti dedicati:

### React Test
```bash
npx create-react-app test-suggesto-react --template typescript
cd test-suggesto-react
npm install @suggesto/react

# Modifica App.tsx per usare SuggestoWidget
npm start
```

### Vue Test  
```bash
npm create vue@latest test-suggesto-vue -- --typescript
cd test-suggesto-vue
npm install
npm install @suggesto/vue

# Usa il componente SuggestoWidget
npm run dev
```

### Nuxt Test
```bash
npx nuxi@latest init test-suggesto-nuxt
cd test-suggesto-nuxt
npm install
npm install @suggesto/nuxt

# Configura nuxt.config.ts con il modulo
npm run dev
```

## 🎯 Output Atteso

Se tutto funziona correttamente, dovresti vedere:

```
🧪 Testing @suggesto/core package...

📦 Test 1: Importing @suggesto/core...
✅ Successfully imported SuggestoWidget

🏗️  Test 2: Creating SuggestoWidget instance...
✅ Widget instance created successfully

🎧 Test 3: Testing event system...
✅ Event listeners registered successfully

⏳ Test 4: Testing widget loading...
✅ Widget loaded successfully

🎮 Test 5: Testing API methods...
✅ API methods work correctly

🧹 Test 6: Testing cleanup...
✅ Widget destroyed successfully

🎉 ALL TESTS PASSED! @suggesto/core is working correctly!
```

## ❌ Troubleshooting

Se i test falliscono:

1. **Pacchetto non trovato su NPM**:
   - Verifica di aver pubblicato correttamente
   - Controlla il nome del pacchetto
   - Aspetta qualche minuto (NPM ha cache)

2. **Import fallisce**:
   - Verifica che il build sia stato fatto correttamente
   - Controlla i file `dist/` nei tuoi pacchetti
   - Assicurati che `main`, `module`, `types` nei package.json siano corretti

3. **Test API falliscono**:
   - Controlla l'implementazione del SuggestoWidget
   - Verifica che tutti i metodi siano esportati correttamente

## 🎉 Successo!

Se tutti i test passano, congratulazioni! I tuoi pacchetti NPM sono pronti e funzionano correttamente. Ora possono essere usati da sviluppatori in tutto il mondo! 🌍
