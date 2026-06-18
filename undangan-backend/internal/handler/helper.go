package handler

import "database/sql"

func toNullString(s *string) sql.NullString {
	if s == nil {
		return sql.NullString{
			Valid: false,
		}
	}

	if *s == "" {
		return sql.NullString{
			Valid: false,
		}
	}

	return sql.NullString{
		String: *s,
		Valid:  true,
	}
}
