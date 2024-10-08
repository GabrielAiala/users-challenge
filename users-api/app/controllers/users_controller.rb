class UsersController < ApplicationController
  before_action :set_user, only: %i[ show update destroy ]

  def index
    if params[:query].present?
      @users = User.where("name LIKE ? OR cpf LIKE ?", "%#{params[:query]}%", "%#{params[:query]}%")
    else
      @users = User.all
    end
  end

  def show
    @user
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      render :show, status: :created, location: @user
    else
      render :error, status: :conflict
    end
  end

  def create
    @user = User.new(user_params)
  
    if @user.save
      render :show, status: :created, location: @user
    else
      render :error, status: :conflict
    end
  end

  def destroy
    @user.destroy
  end

  def set_user
    @user = User.find(params[:id])
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :cpf, :birth_date, addresses_attributes: [:id, :address, :number, :city, :_destroy])
  end

end
