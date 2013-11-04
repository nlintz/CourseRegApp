class AddAttributesToCourse < ActiveRecord::Migration
  def change
    add_column :courses, :name, :string
    add_column :courses, :description, :text
    add_column :courses, :available, :boolean
    add_column :courses, :professor, :string
  end
end
