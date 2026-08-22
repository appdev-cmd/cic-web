import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Counter } from '../src/shared/components/Counter';
import { getLegacyHomePageContent } from '../src/shared/page-content/legacyPageContent';
import { resolvePageContent } from '../src/shared/page-content/resolvePageContent';
import { HomeView } from '../src/web/components/HomeView';

const noop = () => undefined;
const legacyFallback = getLegacyHomePageContent();

const draftResolved = resolvePageContent({
  pageType: 'home',
  version: {
    sections: [{
      sectionKey: 'home.stats',
      config: {
        items: [{ value: 999, suffix: '+', label: 'Draft propagation' }],
      },
    }],
  },
  legacyFallback,
});

assert.equal(draftResolved.source, 'page-builder');
assert.equal(draftResolved.content.stats.items[0]?.value, 999);
assert.equal(draftResolved.diagnostics[0]?.code, 'UNPERSISTED_HOME_STAT_ID');

const falsyResolved = resolvePageContent({
  pageType: 'home',
  version: {
    sections: [{
      sectionKey: 'home.stats',
      config: {
        items: [{ id: 'stat-zero', value: 0, suffix: '', label: '' }],
      },
    }],
  },
  legacyFallback,
});

assert.equal(falsyResolved.source, 'page-builder');
assert.deepEqual(falsyResolved.content.stats.items[0], {
  id: 'stat-zero',
  value: 0,
  suffix: '',
  label: '',
});
assert.equal(falsyResolved.diagnostics.length, 0);

const fallbackResolved = resolvePageContent({
  pageType: 'home',
  version: { sections: [] },
  legacyFallback,
});

assert.equal(fallbackResolved.source, 'legacy');
assert.deepEqual(fallbackResolved.content.stats, legacyFallback.stats);

const invalidResolved = resolvePageContent({
  pageType: 'home',
  version: {
    sections: [{
      sectionKey: 'home.stats',
      config: { items: [{ value: 'invalid', label: 'Invalid' }] },
    }],
  },
  legacyFallback,
});

assert.equal(invalidResolved.source, 'invalid');
assert.deepEqual(invalidResolved.content.stats.items, []);
assert.equal(invalidResolved.diagnostics[0]?.code, 'INVALID_HOME_STATS');

const homeMarkup = renderToStaticMarkup(
  <HomeView
    content={draftResolved.content}
    renderPolicy={{ motionEnabled: false }}
    setCurrentView={noop}
    setActiveLink={noop}
    setActiveServiceId={noop}
    setActiveProjectId={noop}
    setPreSelectedNewsCategory={noop}
    setAboutSubTab={noop}
    setActiveEventId={noop}
    setIsRegisteringEvent={noop}
    editMode
  />,
);

assert.match(homeMarkup, />999\+</);
assert.match(homeMarkup, />Draft propagation</);

const staticCounter = renderToStaticMarkup(<Counter value={999} suffix="+" motionEnabled={false} />);
const animatedCounterInitialFrame = renderToStaticMarkup(<Counter value={999} suffix="+" motionEnabled />);
assert.equal(staticCounter, '<span>999+</span>');
assert.equal(animatedCounterInitialFrame, '<span>0+</span>');

console.log('home.stats wiring verification passed');
