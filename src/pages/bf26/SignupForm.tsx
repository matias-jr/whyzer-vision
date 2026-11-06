import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** Where a successful sign-up lands. Carries first_name so the page can greet them. */
const CONFIRM_PATH = '/black-friday-join';
const CONSENT_TEXT = 'Yes, I want to be a part of the private group to learn about exclusive opportunities.';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The BF26 sign-up form. Posts to /api/bf26-signup, which adds the contact to GHL. */
const SignupForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot, hidden from people
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [bad, setBad] = useState<'firstName' | 'email' | 'consent' | null>(null);

  const fail = (field: typeof bad, msg: string) => { setBad(field); setError(msg); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const name = firstName.trim();
    if (!name) return fail('firstName', 'Please enter your first name.');
    if (!EMAIL_RE.test(email.trim())) return fail('email', 'Please enter a valid email address.');
    if (!consent) return fail('consent', 'Please tick the box to join the private group.');

    setBad(null);
    setError('');
    setSending(true);
    try {
      const res = await fetch('/api/bf26-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: name, email: email.trim(), consent, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'We could not sign you up just now. Please try again.');
      navigate(`${CONFIRM_PATH}?first_name=${encodeURIComponent(name)}`);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not sign you up just now. Please try again.');
      setSending(false);
    }
  };

  return (
    <form className="signup" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="bf-first">First name</label>
        <input
          id="bf-first" name="firstName" type="text" autoComplete="given-name" placeholder="Enter your first name"
          value={firstName} onChange={(e) => setFirstName(e.target.value)} aria-invalid={bad === 'firstName'}
        />
      </div>
      <div className="field">
        <label htmlFor="bf-email">Email</label>
        <input
          id="bf-email" name="email" type="email" autoComplete="email" placeholder="you@company.com"
          value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={bad === 'email'}
        />
      </div>
      <label className="check">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={bad === 'consent'} />
        <span>{CONSENT_TEXT}</span>
      </label>
      <input
        className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={website} onChange={(e) => setWebsite(e.target.value)}
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-block" type="submit" disabled={sending}>
        {sending ? 'Signing you up…' : 'Sign me up!'}
      </button>
    </form>
  );
};

export default SignupForm;
