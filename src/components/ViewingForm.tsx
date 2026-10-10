import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export function ViewingForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus('sending');
    try {
      const { error } = await supabase.from('viewing_requests').insert({ first_name: String(form.get('first_name')).trim(), last_name: String(form.get('last_name')).trim(), email: String(form.get('email')).trim(), phone: String(form.get('phone')).trim(), country: String(form.get('country')), reference: 'BU200.40.AA.AA.C' });
      setStatus(error ? 'error' : 'success');
    } catch { setStatus('error'); }
  }
  return <section id="concierge" className="section"><div className="concierge-layout">
    <div><div className="eyebrow">Private concierge</div><h2>An exceptional timepiece.<br />A personal invitation.</h2><p>Discover the Bugatti Chiron Tourbillon Rose Gold in a private setting. Leave your details to express your interest in a personal viewing.</p><div className="concierge-edition">72 pieces worldwide. An expression of the exceptional.</div></div>
    {status === 'success' ? <div className="form-success" role="status"><Check size={32} /><h3>Your interest is registered.</h3><p>Your private viewing request has been received.</p><Button variant="luxuryOutline" onClick={() => setStatus('idle')}>Submit another inquiry <ArrowUpRight /></Button></div> : <form className="viewing-form" onSubmit={submit}>
      <label className="form-field">First name<input name="first_name" autoComplete="given-name" required maxLength={100} placeholder="First name" /></label>
      <label className="form-field">Last name<input name="last_name" autoComplete="family-name" required maxLength={100} placeholder="Last name" /></label>
      <label className="form-field">Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
      <label className="form-field">Phone number<input name="phone" type="tel" autoComplete="tel" required minLength={5} maxLength={40} placeholder="+1 234 567 890" /></label>
      <label className="form-field form-wide">Country<select aria-label="Country" name="country" autoComplete="country-name" required defaultValue=""><option value="" disabled>Select your country</option>{['United Arab Emirates', 'United States', 'United Kingdom', 'Switzerland', 'France', 'Germany', 'Italy', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Pakistan', 'India', 'China', 'Japan', 'Singapore', 'Hong Kong', 'Australia', 'Canada', 'Other'].map(country => <option key={country}>{country}</option>)}</select></label>
      <p className="form-note form-wide">By submitting, you agree to be contacted about your viewing request. Your details remain private.</p>
      {status === 'error' && <p role="alert" className="form-error form-wide">Your request could not be sent. Please try again.</p>}
      <Button variant="luxury" className="form-wide" type="submit" disabled={status === 'sending'}>{status === 'sending' ? <><LoaderCircle className="animate-spin" />Sending your request</> : <>Request a private viewing <ArrowUpRight /></>}</Button>
    </form>}
  </div></section>;
}