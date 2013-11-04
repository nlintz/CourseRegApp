class AddCourseIdToTag < ActiveRecord::Migration
  def change
    add_column :tags, :course_id, :integer
  end
end
