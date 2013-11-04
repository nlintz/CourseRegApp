# == Schema Information
#
# Table name: sections
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer
#  course_id  :integer
#

class Section < ActiveRecord::Base
	belongs_to :course
end
