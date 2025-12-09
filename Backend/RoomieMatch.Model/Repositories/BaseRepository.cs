using System.Data;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace RoomieMatch.Model.Repositories
{
    public abstract class BaseRepository
    {
        protected readonly string _connectionString;

        public BaseRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("AppProgDb") 
                                ?? throw new ArgumentNullException("Connection string 'AppProgDb' not found.");
        }

        protected IDbConnection CreateConnection()
        {
            return new NpgsqlConnection(_connectionString);
        }
    }
}
