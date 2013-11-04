class User < ActiveRecord::Base
	has_many :tags
	has_many :sections
end
