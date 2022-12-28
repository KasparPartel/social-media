package session

import (
	"fmt"
	"sync"
	"time"

	uuid "github.com/satori/go.uuid"
)

type Session struct {
	uid        string        //user id
	expireTime time.Time     //time of session creation/update
	lifeTime   time.Duration //time after which session dies
}

type Provider struct {
	mu          sync.Mutex
	sessionsMap map[string]*Session
}

var provider Provider

func (m *Provider) SessionAdd(userId string) string {
	m.mu.Lock()
	defer m.mu.Unlock()

	for sessionId, session := range provider.sessionsMap {
		if session.uid == userId {
			return sessionId
		}
	}

	newSessionId := uuid.NewV4().String()
	m.sessionsMap[newSessionId] = &Session{
		uid:        userId,
		expireTime: time.Now(),
		lifeTime:   time.Second * 300,
	}

	return newSessionId
}

func (m *Provider) SessionGet(sessionId string) (*Session, error) {
	if userSession, exists := m.sessionsMap[sessionId]; exists {
		//check if session expired
		if time.Since(userSession.expireTime) < userSession.lifeTime {
			userSession.expireTime = time.Now()
			return userSession, nil
		}
		m.sessionRemove(sessionId)
		return nil, fmt.Errorf("session expired")
	}
	return nil, fmt.Errorf("session doesn't exist")
}

func (m *Provider) sessionRemove(sessionId string) {
	m.mu.Lock()
	defer m.mu.Unlock()

	delete(provider.sessionsMap, sessionId)
}

func (m *Provider) checkExpires() {
	for {
		time.Sleep(time.Second * 60)

		for sid, session := range provider.sessionsMap {
			if time.Since(session.expireTime) >= session.lifeTime {
				m.sessionRemove(sid)
			}
		}
	}
}

func init() {
	provider = Provider{
		sessionsMap: make(map[string]*Session),
	}

	go provider.checkExpires()
}
