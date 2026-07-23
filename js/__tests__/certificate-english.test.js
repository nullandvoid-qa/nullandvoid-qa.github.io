/**
 * Regression test for certificate payload using English track titles and descriptions.
 */

describe('Certificate English content regression', () => {
  beforeEach(() => {
    localStorage.clear();
    window.TG_QAWAY_TRACKS = [
      {
        id: 'intermediate',
        title: 'Testes Avançados',
        description: 'Técnicas de teste mais sofisticadas: automação, performance, segurança.',
        level: 'Intermediário',
        topics: ['Automação', 'Performance', 'Segurança', 'API Testing'],
      },
    ];

    window.TG_QAWAY_EN = {
      tracks: {
        intermediate: {
          title: 'Advanced Testing',
          description: 'Sophisticated testing techniques: automation, performance, security.',
          level: 'Advanced',
          topics: ['Automation', 'Performance', 'Security', 'API Testing'],
        },
      },
    };

    delete require.cache[require.resolve('../certificates.js')];
    require('../certificates.js');
  });

  test('certificate payload uses English title and description for intermediate track', () => {
    const payload = window.TG_CERTIFICATES.buildCertificatePayload('intermediate', 'Guest', new Date('2026-07-23T10:00:00Z'));

    expect(payload.course.name).toBe('Advanced Testing');
    expect(payload.course.subtitle).toBe('Sophisticated testing techniques: automation, performance, security.');
    expect(payload.course.trackName).toBe('Advanced Testing');
    expect(payload.skills).toEqual(['Automation', 'Performance', 'Security', 'API Testing']);
  });
});
