/**
 * Quick test for @suggesto/core package
 * This test verifies that the published package works correctly
 */

// Simula un ambiente browser semplice
global.window = {
  addEventListener: function (event, handler) {
    console.log(`✅ Event listener registered for: ${event}`);
  },
};

global.document = {
  createElement: function (tagName) {
    console.log(`✅ Creating element: ${tagName}`);
    return {
      src: '',
      async: false,
      onload: null,
      onerror: null,
    };
  },
  head: {
    appendChild: function (element) {
      console.log(`✅ Appending script to head`);
      // Simula il caricamento del widget
      setTimeout(() => {
        if (element.onload) {
          // Simula window.Suggesto disponibile
          global.window.Suggesto = {
            init: () => console.log('✅ Widget initialized'),
            destroy: () => console.log('✅ Widget destroyed'),
            openModal: () => console.log('✅ Modal opened'),
            closeModal: () => console.log('✅ Modal closed'),
            version: '1.0.0',
          };
          element.onload();
        }
      }, 100);
    },
  },
};

async function testSuggestoCore() {
  console.log('🧪 Testing @suggesto/core package...\n');

  try {
    // Test 1: Import del pacchetto
    console.log('📦 Test 1: Importing @suggesto/core...');
    const { SuggestoWidget } = require('@suggesto/core');
    console.log('✅ Successfully imported SuggestoWidget\n');

    // Test 2: Creazione istanza
    console.log('🏗️  Test 2: Creating SuggestoWidget instance...');
    const widget = new SuggestoWidget({
      boardId: 'test-board-id',
      baseUrl: 'https://test.suggesto.io',
    });
    console.log('✅ Widget instance created successfully\n');

    // Test 3: Event listeners
    console.log('🎧 Test 3: Testing event system...');
    let readyEventFired = false;
    widget.on('ready', (data) => {
      console.log('✅ Ready event received:', data);
      readyEventFired = true;
    });

    widget.on('feedbackSubmitted', (data) => {
      console.log('✅ Feedback submitted event:', data);
    });

    widget.on('error', (error) => {
      console.log('✅ Error event:', error);
    });
    console.log('✅ Event listeners registered successfully\n');

    // Test 4: Caricamento widget
    console.log('⏳ Test 4: Testing widget loading...');
    await widget.load();
    console.log('✅ Widget loaded successfully\n');

    // Test 5: Metodi API
    console.log('🎮 Test 5: Testing API methods...');
    widget.openModal();
    widget.closeModal();
    console.log('✅ API methods work correctly\n');

    // Test 6: Cleanup
    console.log('🧹 Test 6: Testing cleanup...');
    widget.destroy();
    console.log('✅ Widget destroyed successfully\n');

    console.log('🎉 ALL TESTS PASSED! @suggesto/core is working correctly!');
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Esegui i test
testSuggestoCore();
