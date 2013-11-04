class Course < ActiveRecord::Base
	has_many :sections
	has_many :requirements
	has_many :tags
end
