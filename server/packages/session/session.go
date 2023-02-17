package session

import (
	"net/http"
	"social-network/packages/errorHandler"
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

var SessionProvider Provider

func (m *Provider) SetToken(newSessionId string, w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "TOKEN",
		Value:    newSessionId,
		Expires:  time.Now().Add(time.Hour * 8760), // 1 year
		MaxAge:   31536000,
		HttpOnly: true,
		Path:     "/",
	})
}

func (m *Provider) GetToken(r *http.Request) (string, error) {
	cookie, err := r.Cookie("TOKEN")
	if err != nil {
		return "", err
	}

	sessionId := cookie.Value

	return sessionId, nil
}

func (m *Provider) RemoveToken(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:   "TOKEN",
		MaxAge: -1,
		Path:   "/",
	})
}

func (m *Provider) SessionAdd(userId string) string {
	m.mu.Lock()
	defer m.mu.Unlock()

	for sessionId, session := range SessionProvider.sessionsMap {
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

func (m *Provider) SessionGet(sessionId string) (*Session, *errorHandler.ErrorResponse) {
	if userSession, exists := m.sessionsMap[sessionId]; exists {
		if time.Since(userSession.expireTime) < userSession.lifeTime {
			userSession.expireTime = time.Now()
			return userSession, nil
		}
		m.SessionRemove(sessionId)
		return nil, &errorHandler.ErrorResponse{
			Code:        errorHandler.ErrSessionExpired,
			Description: "session expired",
		}
	}
	return nil, &errorHandler.ErrorResponse{
		Code:        errorHandler.ErrSessionNotExist,
		Description: "session doesn't exist",
	}
}

func (s Session) GetUUID() string {
	return s.uid
}

func (m *Provider) SessionRemove(sessionId string) {
	m.mu.Lock()
	defer m.mu.Unlock()

	delete(SessionProvider.sessionsMap, sessionId)
}

func (m *Provider) checkExpires() {
	for {
		time.Sleep(time.Second * 60)

		for token, session := range SessionProvider.sessionsMap {
			if time.Since(session.expireTime) >= session.lifeTime {
				m.SessionRemove(token)
			}
		}
	}
}

func init() {
	SessionProvider = Provider{
		sessionsMap: make(map[string]*Session),
	}

	go SessionProvider.checkExpires()
}
