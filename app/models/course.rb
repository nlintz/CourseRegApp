# == Schema Information
#
# Table name: courses
#
#  id          :integer          not null, primary key
#  created_at  :datetime
#  updated_at  :datetime
#  name        :string(255)
#  description :text
#  available   :boolean
#  professor   :string(255)
#

class Course < ActiveRecord::Base
	has_many :sections
	has_many :requirements
	has_many :tags
	accepts_nested_attributes_for :tags
end
