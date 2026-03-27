'use client';

import React, { useState } from 'react';
import Head from 'next/head';

export default function LaunchingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call - in production, this would connect to your waitlist service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just log the email (in production, save to database)
      console.log('Waitlist signup:', email);
      
      setIsSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const launchDate = new Date('2025-04-06T09:00:00+01:00'); // Monday 6th April 2025, 9 AM BST

  return (
    <>
      <Head>
        <title>CoreGuard UK - Launching Soon</title>
        <meta name="description" content="Enterprise Security Management System launching April 6th, 2025. Join our waitlist for early access." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="CoreGuard UK - Launching Soon" />
        <meta property="og:description" content="Enterprise Security Management System launching April 6th, 2025" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(247, 185, 28, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(247, 185, 28, 0.05) 0%, transparent 50%)
          `,
          zIndex: 1
        }} />

        <div style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Logo and Shield Icon */}
          <div style={{
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f7b91c, #e6a719)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 8px 32px rgba(247, 185, 28, 0.3)'
            }}>
              🛡️
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #f7b91c, #e6a719)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              CoreGuard UK
            </h1>
          </div>

          {/* Main Content */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '3rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              marginBottom: '1rem',
              color: '#ffffff'
            }}>
              🚀 Launching Soon
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              color: '#a0a0a0',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Enterprise Security Management System designed for regulated private security companies in the UK.
            </p>

            {/* Launch Date */}
            <div style={{
              background: 'rgba(247, 185, 28, 0.1)',
              border: '1px solid rgba(247, 185, 28, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontSize: '0.9rem',
                color: '#f7b91c',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Launch Date
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}>
                Monday, April 6th 2025
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#a0a0a0'
              }}>
                9:00 AM BST
              </div>
            </div>

            {/* Waitlist Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#ffffff',
                    fontWeight: '500'
                  }}>
                    Join the Waitlist
                  </label>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexDirection: 'column'
                  }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      style={{
                        flex: 1,
                        padding: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #f7b91c, #e6a719)',
                        color: '#1e1e1e',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: '120px'
                      }}
                    >
                      {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                    </button>
                  </div>
                  {error && (
                    <div style={{
                      color: '#ef4444',
                      fontSize: '0.9rem',
                      marginTop: '0.5rem'
                    }}>
                      {error}
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '0.5rem'
                }}>
                  ✅
                </div>
                <h3 style={{
                  color: '#22c55e',
                  marginBottom: '0.5rem'
                }}>
                  You're on the list!
                </h3>
                <p style={{
                  color: '#a0a0a0',
                  margin: 0
                }}>
                  We'll notify you as soon as we launch. Get ready to transform your security management!
                </p>
              </div>
            )}

            {/* Features Preview */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                marginBottom: '1rem',
                color: '#ffffff'
              }}>
                What's Coming:
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                textAlign: 'left'
              }}>
                <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  📱 Real-time Personnel Tracking
                </div>
                <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  🏢 Site Management
                </div>
                <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  📋 Compliance Reporting
                </div>
                <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  ⏰ Rota Scheduling
                </div>
                <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  📞 Check-call System
                </div>
                <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  🔒 Audit Trails
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            color: '#676767',
            fontSize: '0.9rem'
          }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              © 2024 CoreGuard UK. All rights reserved.
            </p>
            <p style={{ margin: 0 }}>
              Enterprise Security Management for the UK Private Security Industry
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
