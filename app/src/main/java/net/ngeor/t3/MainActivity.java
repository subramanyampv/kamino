package net.ngeor.t3;

import android.content.Intent;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;
import net.ngeor.t3.ai.AIPlayer;
import net.ngeor.t3.models.*;

public class MainActivity extends AppCompatActivity implements MainActivityView {
    // model
    private GameModel model;

    private HumanPlayer humanPlayer;
    private AIPlayer aiPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // load UI
        setContentView(R.layout.activity_main);

        // set default preferences
        PreferenceManager.setDefaultValues(this, R.xml.preferences, false);

        // restore model
        if (savedInstanceState != null) {
            StateManager stateManager = new StateManager(savedInstanceState);
            GameDto savedGameState = stateManager.getGame();
            model = new GameModel(savedGameState);
        } else {
            model = createGameModel();
        }

        setModel(model);

        // create touch listener
        humanPlayer = new HumanPlayer(model, Player.X);
        getBoardView().setOnTouchListener(humanPlayer);

        // set AILevel from settings
        SettingsAdapter settingsAdapter = new SettingsAdapter(this);
        aiPlayer = new AIPlayer(model, Player.O);
        aiPlayer.setAILevel(settingsAdapter.getAILevel());

        findViewById(R.id.btn_restart).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final GameModel newModel = createGameModel();
                setModel(newModel);
            }
        });

        findViewById(R.id.btn_settings).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
                startActivity(intent);
            }
        });
    }


    @Override
    protected void onResume() {
        super.onResume();
        SettingsAdapter settings = new SettingsAdapter(this);
        if (aiPlayer != null && aiPlayer.getAILevel() != settings.getAILevel()) {
            // settings changed
            // TODO: do not change AI level mid-game
            aiPlayer.setAILevel(settings.getAILevel());
        }
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        StateManager stateManager = new StateManager(outState);
        stateManager.setGame(new GameDto(model));
    }

    @Override
    public void setHeaderText(int resourceId) {
        getHeaderView().setText(resourceId);
    }

    @Override
    public void invalidateBoardView() {
        getBoardView().invalidate();
    }

    private BoardView getBoardView() {
        return (BoardView) findViewById(R.id.board);
    }

    private TextView getHeaderView() {
        return (TextView) findViewById(R.id.header);
    }

    private void setModel(GameModel model) {
        this.model = model;
        getBoardView().setModel(model.getBoardModel());
        GameListener gameListener = new GameListener(this);
        model.addGameModelListener(gameListener);
        model.addGameModelListener(aiPlayer);

        if (model.getState() == GameState.NotStarted) {
            model.start();
        } else {
            // when resuming after device orientation changes,
            // the text needs to be refreshed
            gameListener.updateHeaderText(model);
        }
    }

    private GameModel createGameModel() {
        return new GameModel(3, 3, createPlayerAssignment());
    }

    private PlayerAssignment createPlayerAssignment() {
        SettingsAdapter settings = new SettingsAdapter(this);
        return new PlayerAssignment(settings.getFirstPlayer());
    }
}
