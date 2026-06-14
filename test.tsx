import test from 'ava';
import {validate} from './source/lib/domains.js';

test('validate accepts a well-formed local domain', t => {
	t.is(validate('myapp.local', 3000, []), undefined);
});

test('validate rejects a host without a dot', t => {
	t.truthy(validate('myapp', 3000, []));
});

test('validate rejects an out-of-range port', t => {
	t.truthy(validate('myapp.local', 70_000, []));
});

test('validate rejects a duplicate host', t => {
	const existing = [
		{host: 'myapp.local', port: 3000, https: true, createdAt: ''},
	];
	t.truthy(validate('myapp.local', 4000, existing));
});

test('main menu renders the title and options', t => {
	const {lastFrame} = render(<MainMenu onSelect={() => undefined} />);
	const frame = lastFrame() ?? '';
	t.true(frame.includes('hostly'));
	t.true(frame.includes('Domains'));
});
